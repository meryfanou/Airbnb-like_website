const 	express = require("express"),
	  	router  = express.Router(),
		User	= require("../models/user"),
		Apartment	= require("../models/apartment");

// ROUTES

// ----------------------------------------- REVIEWS FOR HOST  ----------------------------------------- //

// NEW Route 
router.get("/host/new", function(req, res){
	var host = JSON.parse(req.query.host);

	res.render("reviews/host/new", { host: host });
});

// POST Route
router.post("/host/:tenant_id/:host_id", function(req,res){

	User.findById(req.params.tenant_id,function(err,tenant){

		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = dd + '-' + mm + '-' + yyyy;

		var review = {
			about: req.params.host_id.toString(),
			text: req.body.text,
			rating: req.body.rating,
			date: today,
			author: tenant._id
		};
	
		tenant.reviews.push(review);
		tenant.save();
	
		User.findById(req.params.host_id, function(err,host){

			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			host.reviews.push(review);
			host.save();
			
			req.flash("success", "Your review was submitted successfully.");
			return res.redirect("/reviews/host/" + host._id);
		});

	});
	
});


// SHOW Route - show more info about the reviews from one specific host

router.get("/host/:id", function(req,res){
	User.findById(req.params.id, function(err, host){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("reviews/host/show", { host: host });
		}
	});
});


// ----------------------------------------- REVIEWS FOR APARTMENT ----------------------------------------- //

// NEW - Route

router.get("/apartment/new", function(req, res){
	var apartment = JSON.parse(req.query.apartment);

	res.render("reviews/apartment/new", { apartment: apartment });
});

// POST Route
router.post("/apartment/:tenant_id/:apartment_id", function(req,res){

	User.findById(req.params.tenant_id,function(err,tenant){

		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = dd + '-' + mm + '-' + yyyy;

		var review = {
			about: req.params.apartment_id.toString(),
			text: req.body.text,
			rating: req.body.rating,
			date: today,
			author: tenant._id
		};
	
		tenant.reviews.push(review);
		tenant.save();
	
		Apartment.findById(req.params.apartment_id, function(err,apartment){

			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			apartment.reviews.push(review);
			apartment.save();
			
			req.flash("success", "Your review was submitted successfully.");
			return res.redirect("/reviews/apartment/" + apartment._id);
		});

	});
	
});


// SHOW - Route

router.get("/apartment/:id", function(req,res){
	Apartment.findById(req.params.id, function(err, foundApartment){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("reviews/apartment/show", { apartment: foundApartment });
		}
	});
});

//  // CREATE Route - Create a new review for one specific host
// router.post("/", middleware.isLoggedIn, function(req, res){
// 	Campground.findById(req.params.id, function(err, campground){
// 		if(err){
// 			req.flash("error", err.message);
// 			res.redirect("/campgrounds");
// 		}else{
// 			Comment.create(req.body.comment, function(err, comment){
// 				if(err){
// 					req.flash("error", err.message);
// 					res.redirect("/campgrounds" + campgrounds._id);
// 				}else{
// 					comment.author.id = req.user._id;
// 					comment.author.username = req.user.username;
// 					comment.save();
// 					campground.comments.push(comment);
// 					campground.save();
// 					req.flash("success", "Successfully added comment");
// 					res.redirect("/campgrounds/" + campground._id);
// 				}
// 			});
// 		}
// 	});
// })







module.exports = router;