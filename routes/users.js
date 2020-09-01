const express	 = require("express"),
	  router 	 = express.Router(),
	  multer	 = require("multer"),
	  cloudinary = require("cloudinary"),
	  User   	 = require("../models/user"),
	  middleware = require("../middleware");

// MULTER CONFIGURATION
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
var upload = multer({storage: storage, fileFilter: imageFilter});


// CLOUDINARY CONFIGURATION
cloudinary.config({
	cloud_name: "meryf",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});


// ROUTES
router.get("/:id/host", function(req,res){
	User.findById(req.params.id,).populate("apartments").exec(function(err, foundUser){
	 	if(err){
	 		req.flash("error", err.message);
	 		res.redirect("back");
	 	}else if(!foundUser){
	 		req.flash("error", "User not found");
			res.redirect("back");
	 	}else{
	 		res.render("users/host", {apartments: foundUser.apartments});
	 	}
	 });
});


router.get("/:id/edit", function(req,res){

	User.findById(req.params.id, function(err, foundUser){

		if(err){
			req.flash("error",err.message);
			res.redirect("/");
		}
		else{
			res.render("users/edit", {user: foundUser});
		}
	});
});


module.exports = router;