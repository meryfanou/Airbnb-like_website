const express	 	= require("express"),
	  router	 	= express.Router(),
	  Apartment		= require("../models/apartment"),
	  url			= require("url");


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
				diff = Math.round((d2-d1)/one_day) + 1;

			var	price,
				max_price = 0,
				values = [],
				sorted = [];

			apartments.forEach(function(apartment){
				values.push([apartment._id, apartment.price_min]);
			});

			values.sort(function([a,b],[c,d]){return b-d});
			values.forEach(function([id, price]){
				for(var apartment of apartments){
					if(apartment._id == id){
						sorted.push(apartment);
						if(price  > max_price){
							max_price = price;
						}
						break;
					}
				}
			});

			var str_apartments = JSON.stringify(sorted);

			res.redirect(url.format({
				pathname: "/search/page/1",
				query: {
					"apartments": str_apartments,
					"num_days": diff,
					"guests": guests,
					"check_in": check_in,
					"check_out": check_out,
					"location": location,
					"max_price": max_price
				}
			}));
			// res.render("search/index", {apartments: sorted, num_days: diff,	guests: guests,
			// 							check_in: check_in, check_out: check_out,
			// 							location: location,	max_price: max_price});
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
			res.render("search/show", {apartment: foundApartment, num_days: req.query.num_days,
									   guests: req.query.guests, check_in: req.query.check_in,
									   check_out: req.query.check_out});
		}
	});
});


router.post("/filters", function(req,res){
	var str_apartments = req.query.str_apartments,
		num_days = req.query.num_days,
		guests = req.query.guests,
		check_in = req.query.check_in,
		check_out = req.query.check_out,
		location = req.query.location,
		apartments = [];

	var	facilities = Object.assign({}, req.body.facilities),
		filters = {
			room_type: req.body.room_type,
			max_price: req.body.max_price,
			facilities: facilities
		},
		valid_room_type,
		valid_max_price,
		valid_facilities,
		filtered = [];

	apartments = JSON.parse(str_apartments);

	for(var apartment of apartments){
		valid_room_type = false;
		valid_max_price = false;
		valid_facilities = false;

		if(filters.room_type){
			if(typeof filters.room_type == "string" && apartment.place.room_type == filters.room_type){
				valid_room_type = true;
			}else if(typeof filters.room_type == "object"){		// an array in specific
				valid_room_type = filters.room_type.includes(apartment.place.room_type);
			}else{
				valid_room_type = false;
				continue;
			}
		}else{
			valid_room_type = true;
		}

		if(apartment.price_min <= filters.max_price){
			valid_max_price = true;
		}

		if(typeof facilities.length != 'undefined'){
			for([key,value] of Object.entries(facilities)){
				if(apartment.facilities.hasOwnProperty(key) && facilities.key == value){
					valid_facilities = true;
					continue;
				}

				valid_facilities = false;
				break;
			}
		}else{
			valid_facilities = true;
		}

		if(valid_room_type && valid_max_price && valid_facilities){
			filtered.push(apartment);
		}
	};

	res.render("search/index", {apartments: filtered, initial: apartments, filters: filters,
								num_days: num_days,	guests: guests, check_in: check_in,
								check_out: check_out, location: location, max_price: req.query.max_price});
});


// Pagination
router.get("/page/:pageNum", function(req,res){
	var apartments = JSON.parse(req.query.apartments),
		num_days   = req.query.num_days,
		guests	   = req.query.guests,
		check_in   = req.query.check_in,
		check_out  = req.query.check_out,
		location   = req.query.location,
		max_price  = req.query.max_price;

	var results_per_page = 1,
		start			 = (req.params.pageNum - 1) * results_per_page;

	var paginated = apartments.slice(start,start + results_per_page);

	res.render("search/index", {apartments: paginated, all_apartments: apartments,
								results_per_page: results_per_page, pageNum: req.params.pageNum,
								num_days: num_days, guests: guests,	check_in: check_in,
								check_out: check_out, location: location, max_price: max_price});
});

module.exports = router;