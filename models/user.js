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
	picture: String,
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