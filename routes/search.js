const express	 	= require("express"),
	  router	 	= express.Router(),
	  Apartment		= require("../models/apartment");


router.post("/", function(req, res){
	var location = req.body.location,
		check_in = req.body.check_in,
		check_out = req.body.check_out,
		guests = req.body.guests,
		apartments = [];

	Apartment.find({}, function(err, results){
		if(err){
			req.flash("error", err.message);
			res.redirect("/");
		}else{
			// Check if the renting dates are valid
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			today = yyyy + '-' + mm + '-' + dd;

			if(check_in.valueOf() < today.valueOf() ||
			   check_out.valueOf() < today.valueOf() ||
			   check_in.valueOf() > check_out.valueOf()){
				req.flash("error", "Dates should be valid. Please try again.");
				return res.redirect("/");
			}

			results.forEach(function(apartment){
				if(check_in.valueOf() >= apartment.availability_from.valueOf() &&
				   check_out.valueOf() <= apartment.availability_to.valueOf() &&
				   check_in.valueOf() <= check_out.valueOf() &&
				   guests <= apartment.capacity){
					apartments.push(apartment);
				}
			});

			if(apartments.length == 0){
				req.flash("warning", "No results found for your search.");
				return res.redirect("/");
			}

			var d1 = Date.parse(check_in),
				d2 = Date.parse(check_out),
				one_day = 1000*60*60*24,
				diff = Math.round((d2-d1)/one_day);

			res.render("search/index", {apartments: apartments, num_days: diff});
		}
	});
});

// SHOW Route - show more info about one specific search result
router.get("/:id", function(req,res){
	Apartment.findById(req.params.id).populate("reviews").populate("host").populate("reservations").exec(function(err, foundApartment){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("search/show", {apartment: foundApartment});
		}
	});
});


module.exports = router;