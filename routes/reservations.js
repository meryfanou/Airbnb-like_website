const	express	 	= require("express"),
	  	router	 	= express.Router(),
	  	User		= require("../models/user"),
	  	Apartment	= require("../models/apartment"),
	  	url			= require("url");


router.post("/:tenant_id/:apartment_id",function(req,res){
	var check_in  = req.query.check_in,
		check_out = req.query.check_out,
		guests	  = req.query.guests;

	Apartment.findById(req.params.apartment_id, function(err,foundApartment){
		if(err){
			req.flash("error",err.message);
			return res.redirect("back");
		}

		var reservation = {
			tenant: req.params.tenant_id,
			from:	check_in,
			to:		check_out
		};

		foundApartment.reservations.push(reservation);


		foundApartment.save();
	});
});









module.exports = router;