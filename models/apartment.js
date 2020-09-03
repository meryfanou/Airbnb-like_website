const mongoose = require("mongoose");

var apartmentSchema = mongoose.Schema({
	
	name: String,
	place: {
		bedrooms: Number,
		beds: Number,
		bathrooms: Number,
		room_type: String,				// private room, shared room, apartment
		living_room: { type: String, default: 'False'},
		floor: String,
		area: Number
	},
	description: String,
	renting_rules: {
		smoking: { type: String, default: 'False'},
		pets: { type: String, default: 'False'},
		events: { type: String, default: 'False'},
		rent_days_min: Number
	},
	facilities: {
		wifi: { type: String, default: 'False'},
		air_conditioning: { type: String, default: 'False'},
		heating: { type: String, default: 'False'},
		kitchen: { type: String, default: 'False'},
		tv: { type: String, default: 'False'},
		parking: { type: String, default: 'False'},
		elevator: { type: String, default: 'False'}
	},
	location: {
		// Openstreetmap
		address: String,
		lat: Number,
		lng: Number,
		neighbourhood: String,
		transportation: String
	},
	main_image: {
		url: String,
		public_id: String
	},
	images: [
		{
			url: String,
			public_id: String
		}
	],
	price_min: Number,
	extra_charge_per_guest: Number,
	availability_from: Date,			// dates availble to rent
	availability_to: Date,			// dates availble to rent
	capacity: Number,					// maximum number of persons
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


module.exports = mongoose.model("Apartment", apartmentSchema);