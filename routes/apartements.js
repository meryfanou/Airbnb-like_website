const express	 = require("express"),
	  router	 = express.Router(),
	  multer	 = require("multer"),
	  cloudinary = require("cloudinary"),
	  User		 = require("../models/user"),
	  Apartement = require("../models/apartement");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


// MULTER CONFIGURATION
var upload = multer({ "dest": "../uploads/"});


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

<<<<<<< HEAD
//CREATE - add new campground to DB

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
=======
router.post("/", upload.array("images", 30), async(req,res) => {
	req.body.apartement["images"] = [];

	var	i=0;
	for(const file of req.files){
		let image = await cloudinary.v2.uploader.upload(file.path);
		if(i == 0){
			req.body.apartement["main_image"] = {
				url: image.secure_url,
				public_id: image.public_id
			};
		}else{
			req.body.apartement.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
>>>>>>> upload_images
		}
	
		i += 1;
	}

	req.body.apartement["place"] = Object.assign({}, req.body.place);
	req.body.apartement["renting_rules"] = Object.assign({}, req.body.renting_rules);
	req.body.apartement["facilities"] = Object.assign({}, req.body.facilities);
	req.body.apartement["location"] = Object.assign({}, req.body.location);
	req.body.apartement["host"] = Object.assign({}, req.user._doc);
	req.body.apartement["reservations"] = [];
	req.body.apartement["reviews"] = [];

<<<<<<< HEAD
		
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
=======
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
>>>>>>> upload_images
	});
	console.log(req.body.apartement);
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