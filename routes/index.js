var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	User 	 = require("../models/user");


// Welcome Page
router.get("/", function(req, res){
	res.render("landing");
});


//show the register form
router.get("/register", function(req, res){
	res.render("register");
});

// handle sing up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username,
						   firstname: req.body.firstname,
						   lastname: req.body.lastname,
						   email: req.body.email,
						   phone_number: req.body.phone_number,
						   app_role: req.body.app_role,
						   picture: req.body.picture});
	if(req.body.password != req.body.confirm_password){
		req.flash("error", "Password confirmation failed. Please try again.");
		res.redirect("/register");
	}else{
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error", err.message);
				return res.redirect("/register");
			}
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to Airbnb " + user.username);
				if(user.app_role.includes("host")){
					req.flash("warning",
							  "The approval of your registration in Airbnb as a host is pending");
					return res.redirect("/users/host");
				}
				res.redirect("/");
			})
		});
	}
});


// show login form
router.get("/login", function(req, res){
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",
	{
		failureRedirect: "/login"
	}), function(req, res){
	req.flash("success", "Welcome back " + req.user.username);
	if(req.user.app_role.includes("host")){
		res.redirect("/users/host");
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


module.exports = router;