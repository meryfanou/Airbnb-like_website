const 	express 	= require("express"),
		router  	= express.Router(),
		User		= require("../models/user"),
		Apartment	= require("../models/apartment"),
		Review		= require("../models/review");

// ROUTES

// NEW Route 
router.get("/host/new", function(req, res){
	var host = JSON.parse(req.query.host);

	res.render("reviews/host/new", { host: host, apartment: req.query.apartment });
});

// Create Route
router.post("/host/:tenant_id/:host_id", function(req,res){
	User.findById(req.params.tenant_id).populate("reviews").exec(function(err,tenant){
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
	
		Review.create(review, function(err, newReview){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			newReview.save();

			tenant.reviews.push(newReview);
			tenant.save();

			User.findById(req.params.host_id, function(err,host){
				if(err){
					req.flash("error", err.message);
					return res.redirect("back");
				}

				host.reviews.push(newReview);
				host.save();
			
				req.flash("success", "Your review was submitted successfully.");
				return res.redirect("/reviews/host/" + req.query.apartment);
			});
		});
	});
});


// Edit Route 
router.get("/host/:id/edit", function(req, res){
	Review.findById(req.params.id).populate("author").exec(function(err,review){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var host = JSON.parse(req.query.host);
		res.render("reviews/host/edit", { review: review, host: host, apartment: req.query.apartment });
	});
});

// Update Route
router.put("/host/:id", function(req,res){
	Review.findById(req.params.id, function(err, review){
		// Update rating
		review.rating = req.body.rating;

		// Update text
		review.text = req.body.text;

		// Update date
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		review.date = dd + '-' + mm + '-' + yyyy;

		review.save();

		req.flash("success", "Review updated successfully.");
		return res.redirect("/reviews/host/" + req.query.apartment);
	});
});

// SHOW Route - show more info about the reviews from one specific host
router.get("/host/:apartment_id", function(req,res){
	Apartment.findById(req.params.apartment_id)
	.populate({ path:"host", populate: { path:"reviews", populate: { path:"author" }}})
	.exec(function(err, apartment){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("reviews/host/show", { host: apartment.host, apartment: apartment });
		}
	});
});

// Delete Route
router.delete("/host/:id", function(req,res){
	// Remove review from host's reviews
	User.findById(req.query.host).populate("reviews").exec(function(err,host){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var i= 0;
		for(var review of host.reviews){
			if(review._id.equals(req.params.id)){
				var part1 = host.reviews.slice(0,i);
				var part2 = host.reviews.slice(i+1,host.reviews.length);

				host.reviews = part1.concat(part2);
			}
			i += 1;
		}
		host.save();

		// Remove review from tenant's reviews
		User.findById(req.user._id).populate("reviews").exec(function(err,tenant){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			var i= 0;
			for(var review of tenant.reviews){
				if(review._id.equals(req.params.id)){
					var part1 = tenant.reviews.slice(0,i);
					var part2 = tenant.reviews.slice(i+1,tenant.reviews.length);

					tenant.reviews = part1.concat(part2);
				}
				i += 1;
			}
			tenant.save();

			Review.findByIdAndRemove(req.params.id, function(err){
				if(err){
					req.flash("error", err.message);
					return res.redirect("back");
				}

				req.flash("success", "Your review was deleted successfully.");
				return res.redirect("/reviews/host/" + req.query.apartment);
			});
		});
	});
});


module.exports = router;