const mongoose = require("mongoose");

var apartementSchema = mongoose.Schema({
	name: String,
	place: {
		bedrooms: String,
		beds: String,
		bathrooms: String,
		type: String,				// private room, shared room, apartement
		living_room: Boolean,
		area: String
	},
	description: String,
	renting_rules: {
		smoking: Boolean,
		pets: Boolean,
		events: Boolean,
		rent_days_min: String
	},
	facilities: {
		wifi: Boolean,
		air_conditioning: Boolean,
		heating: Boolean,
		kitchen: Boolean,
		tv: Boolean,
		parking: Boolean,
		elevator: Boolean
	},
	location: {
		// Openstreetmap
		address: String,
		neighbourhood: String,
		transportation: String
	},
	main_image: String,
	images: [ String ],
	price_min: String,
	extra_charge_per_person: String,
	availability: String,			// dates availble to rent
	capacity: String,				// maximum number of persons
	host: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	reservations: [
		{
			tenant: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			time_period: String
		}
	],
	reviews: [
		{
			rating: String,
			text: String,
			author: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		}
	]
});


module.exports = mongoose.model("Apartement", apartementSchema);