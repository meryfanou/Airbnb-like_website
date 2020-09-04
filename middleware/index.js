var Apartment = require("../models/apartment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first.");
	res.redirect("/login");
};

middlewareObj.checkApartmentOwnership = function(req, res, next){
	// Check if user is logged in
	if(req.isAuthenticated()){
		Apartment.findById(req.params.id, function(err, foundApartment){
			// If there is an error
			if(err){
				req.flash("error", err.message);
				res.redirect("back");
			// If there is no such apartment in the db
			}else if(!foundApartment){
				req.flash("error", "Place not found");
				res.redirect("back");
			}else{
				// Check if the user owns the apartment
				if(foundApartment.host._id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have host permissions.");
					res.redirect("back");
				}
			}
		});	
	}else{
		req.flash("error", "Please login first.");
		res.redirect("/login");
	}	
};

module.exports = middlewareObj;