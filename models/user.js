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
	picture: { type: String,
			  default: "https://icon-library.com/images/no-profile-pic-icon/no-profile-pic-icon-12.jpg"},
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message"
		}
	],
	apartements: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Apartement"
		}
	]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);