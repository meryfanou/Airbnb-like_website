const express	 = require("express"),
	  router	 = express.Router(),
	  multer	 = require("multer"),
	  cloudinary = require("cloudinary"),
	  User		 = require("../models/user"),
	  Apartement = require("../models/apartement");

// MULTER CONFIGURATION
// Whenever a file gets uploaded we create a custom name for that file
// The name we are giving is gonna have the current time stamp + the original name of the file
var storage = multer.diskStorage({
	filename: function(req, file, callback){
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function(req, file, cb){
	// Accept image files only
	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
		return cb(new Error("Only image files are allowed!"), false);
	}
	cb(null,true);
};
// We pass the configuration variables
var upload = multer({storage: storage, fileFilter: imageFilter});

// CLOUDINARY CONFIGURATION
cloudinary.config({
	cloud_name: "meryf",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});



// New Route
router.get("/new", function(req,res){
	res.render("apartements/new");
});

//router.post("/", function(req,res){
// Add upload image middleware => inside single: name attribute of input form from apartements/new.ejs
router.post("/", upload.single("image"), function(req,res){
	// req.file.path: the name that just got uploaded from the form (from multer)
	// We get a result back from the cloudinary
	cloudinary.uploader.upload(req.file.path, function(result){
		// We want to store the image's secure_url (https://)
		req.body.apartement.main_image = result.secure_url;

		req.body.apartement["place"] = Object.assign({}, req.body.place);
		req.body.apartement["renting_rules"] = Object.assign({}, req.body.renting_rules);
		req.body.apartement["facilities"] = Object.assign({}, req.body.facilities);
		req.body.apartement["location"] = Object.assign({}, req.body.location);
		req.body.apartement["host"] = Object.assign({}, req.user._doc);
		req.body.apartement["reservations"] = [];
		req.body.apartement["reviews"] = [];

		var	tempApartement = new Apartement({});
		if(!req.body.apartement.place.living_room){
			req.body.apartement.place.living_room = tempApartement.place.living_room;
		}
		if(!req.body.apartement.renting_rules.smoking){
			req.body.apartement.renting_rules.smoking = tempApartement.renting_rules.smoking;
		}
		if(!req.body.apartement.renting_rules.pets){
			req.body.apartement.renting_rules.pets = tempApartement.renting_rules.pets;
		}
		if(!req.body.apartement.renting_rules.events){
			req.body.apartement.renting_rules.eventse = tempApartement.renting_rules.events;
		}
		if(!req.body.apartement.facilities.wifi){
			req.body.apartement.facilities.wifi = tempApartement.facilities.wifi;
		}
		if(!req.body.apartement.facilities.air_conditioning){
			req.body.apartement.facilities.air_conditioning = tempApartement.facilities.air_conditioning;
		}
		if(!req.body.apartement.facilities.heating){
			req.body.apartement.facilities.heating = tempApartement.facilities.heating;
		}
		if(!req.body.apartement.facilities.kitchen){
			req.body.apartement.facilities.kitchen = tempApartement.facilities.kitchen;
		}
		if(!req.body.apartement.facilities.tv){
			req.body.apartement.facilities.tv = tempApartement.facilities.tv;
		}
		if(!req.body.apartement.facilities.parking){
			req.body.apartement.facilities.parking = tempApartement.facilities.parking;
		}
		if(!req.body.apartement.facilities.elevator){
			req.body.apartement.facilities.elevator = tempApartement.facilities.elevator;
		}

		User.findById(req.user._id, function(err, user){
			if(err){
				req.flash("error", err.message);
				res.redirect("/users/" + user._id + "/host");
			}else if(!user){
				console.log("User not found");
				req.flash("error", "User not found");
				res.redirect("back");
			}else{
				Apartement.create(req.body.apartement, function(err, apartement){
					if(err){
						req.flash("error", err.message);
						res.redirect("/users/" + user._id + "/host");
					}else{
						apartement.save();
						user.apartements.push(apartement);
						user.save();
						req.flash("success", "Added a new place successfully!");
						res.redirect("/users/" + user._id + "/host");
					}
				});
			}
		});
	});
});

// SHOW Route - show more info about one specific appartement

router.get("/:id",function(req,res){
	
	Apartement.findById(req.params.id).populate("reviews").populate("host").exec(function(err, foundApartement){
		if(err){
			
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			
			
			res.render("apartements/show", {apartement: foundApartement});
		}
	});

});

module.exports = router;