var express    = require("express"),
	router     = express.Router(),
	multer	   = require("multer"),
	cloudinary = require("cloudinary"),
	passport   = require("passport"),
	User 	   = require("../models/user");

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



// Welcome Page
router.get("/", function(req, res){
	res.render("landing");
});


//show the register form
router.get("/register", function(req, res){
	res.render("register");
});

// handle sing up logic
router.post("/register", upload.single("image"), function(req, res){
	if(req.file){
		cloudinary.uploader.upload(req.file.path, function(result){
			// We want to store the image's secure_url (https://)
			req.body.user.picture = result.secure_url;

			req.body.user.username = req.body.username;
			req.body.user["messages"] = [];
			req.body.user["apartments"] = [];

			if(req.body.password != req.body.confirm_password){
				req.flash("error", "Password confirmation failed. Please try again.");
				res.redirect("/register");
			}else{
				req.body.user.password = req.body.password;
				User.register(req.body.user, req.body.password, function(err, user){
					if(err){
						req.flash("error", err.message);
						return res.redirect("/register");
					}
					passport.authenticate("local")(req, res, function(){
						req.flash("success", "Welcome to Airbnb " + user.username);
						if(user.app_role.includes("host")){
							req.flash("warning",
									  "The approval of your registration in Airbnb as a host is pending");
							return res.redirect("/users/" + req.user._id + "/host");
						}
						res.redirect("/");
					})
				});
			}
		});
	}else{
		var	tempUser = new User({});
		req.body.user.picture = tempUser.picture;

		req.body.user.username = req.body.username;
		req.body.user["messages"] = [];
		req.body.user["apartments"] = [];

		if(req.body.password != req.body.confirm_password){
			req.flash("error", "Password confirmation failed. Please try again.");
			res.redirect("/register");
		}else{
			req.body.user.password = req.body.password;
			User.register(req.body.user, req.body.password, function(err, user){
				if(err){
					req.flash("error", err.message);
					return res.redirect("/register");
				}
				passport.authenticate("local")(req, res, function(){
					req.flash("success", "Welcome to Airbnb " + user.username);
					if(user.app_role.includes("host")){
						req.flash("warning",
								  "The approval of your registration in Airbnb as a host is pending");
						return res.redirect("/users/" + req.user._id + "/host");
					}
					res.redirect("/");
				})
			});
		}
	}
});


// show login form
router.get("/login", function(req, res){
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",
	{
		failureRedirect: "/login",
		failureFlash: true
	}), function(req, res){
	req.flash("success", "Welcome back " + req.user.username);
	if(req.user.app_role.includes("host")){
		res.redirect("/users/" + req.user._id + "/host");
	}else{
		res.redirect("/");
	}
});


// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out successfully");
	res.redirect("/");
});

//profile edit route 



// router.get("/:user_id/edit", middleware.checkCommentOwnership, function(req, res){
// 	User.findById(req.params.user_id, function(err, foundUser){
// 		if(err){
// 			req.flash("error", err.message);
// 			res.redirect("back");
// 		}else{
// 			res.render("users/edit", {user_id: req.params.id, comment: User});
// 		}
// 	});
// });
	
	
	
	
		   
		  
		   


module.exports = router;