const mongoose				= require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose");

// SCHEMA SETUP
var userSchema = mongoose.Schema({
	username: String,
	password: String,
	firstname: String,
	lastname: String,
	email: String,
	phone_number: String,
	app_role: [ String ],			// anonymous guest, tenant, host, admin
	picture: {
		url: {
			type: String,
			default: "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-12.jpg"
		},
		public_id: {
			type: String,
			default: "Default"
		}
	},
	messages: [
		{
			apartment: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Apartment"
			},
			conversation: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Message"
				}
			]
		}
	],
	apartments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Apartment"
		}
	],
	reviews: [
		{
			about: String,
			rating: Number,
			text: String,
			date: String,
			author: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);