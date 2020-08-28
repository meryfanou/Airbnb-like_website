const express	 = require("express"),
	  router	 = express.Router(),
	  multer	 = require("multer"),
	  cloudinary = require("cloudinary"),
	  User		 = require("../models/user"),
	  apartment = require("../models/apartment");

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



// New Route for a host's apartment
router.get("/new", function(req,res){
	res.render("apartments/new");
});


// Create Route for a host's apartment
router.post("/", upload.array("images", 30), async(req,res) => {
	req.body.apartment["images"] = [];

	var	i=0;
	// For each uploaded image
	for(const file of req.files){
		let image = await cloudinary.v2.uploader.upload(file.path);
		// The firstly uploaded image should be the apartment's main image
		if(i == 0){
			req.body.apartment["main_image"] = {
				url: image.secure_url,
				public_id: image.public_id
			};
		}else{
			req.body.apartment.images.push({
				url: image.secure_url,
				public_id: image.public_id
			});
		}
	
		i += 1;
	}

	req.body.apartment["place"] = Object.assign({}, req.body.place);
	req.body.apartment["renting_rules"] = Object.assign({}, req.body.renting_rules);
	req.body.apartment["facilities"] = Object.assign({}, req.body.facilities);
	req.body.apartment["location"] = Object.assign({}, req.body.location);
	req.body.apartment["host"] = Object.assign({}, req.user._doc);
	req.body.apartment["reservations"] = [];
	req.body.apartment["reviews"] = [];

	var	tempapartment = new apartment({});
	if(!req.body.apartment.place.living_room){
		req.body.apartment.place.living_room = tempapartment.place.living_room;
	}
	if(!req.body.apartment.renting_rules.smoking){
		req.body.apartment.renting_rules.smoking = tempapartment.renting_rules.smoking;
	}
	if(!req.body.apartment.renting_rules.pets){
		req.body.apartment.renting_rules.pets = tempapartment.renting_rules.pets;
	}
	if(!req.body.apartment.renting_rules.events){
		req.body.apartment.renting_rules.eventse = tempapartment.renting_rules.events;
	}
	if(!req.body.apartment.facilities.wifi){
		req.body.apartment.facilities.wifi = tempapartment.facilities.wifi;
	}
	if(!req.body.apartment.facilities.air_conditioning){
		req.body.apartment.facilities.air_conditioning = tempapartment.facilities.air_conditioning;
	}
	if(!req.body.apartment.facilities.heating){
		req.body.apartment.facilities.heating = tempapartment.facilities.heating;
	}
	if(!req.body.apartment.facilities.kitchen){
		req.body.apartment.facilities.kitchen = tempapartment.facilities.kitchen;
	}
	if(!req.body.apartment.facilities.tv){
		req.body.apartment.facilities.tv = tempapartment.facilities.tv;
	}
	if(!req.body.apartment.facilities.parking){
		req.body.apartment.facilities.parking = tempapartment.facilities.parking;
	}
	if(!req.body.apartment.facilities.elevator){
		req.body.apartment.facilities.elevator = tempapartment.facilities.elevator;
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
			apartment.create(req.body.apartment, function(err, apartment){
				if(err){
					req.flash("error", err.message);
					res.redirect("/users/" + user._id + "/host");
				}else{
					apartment.save();
					user.apartments.push(apartment);
					user.save();
					req.flash("success", "Added a new place successfully!");
					res.redirect("/users/" + user._id + "/host");
				}
			});
		}
	});
	console.log(req.body.apartment);
});

// SHOW Route - show more info about one specific appartement

router.get("/:id",function(req,res){
	
	apartment.findById(req.params.id).populate("reviews").populate("host").exec(function(err, foundapartment){
		if(err){
			
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			
			
			res.render("apartments/show", {apartment: foundapartment});
		}
	});

});

module.exports = router;