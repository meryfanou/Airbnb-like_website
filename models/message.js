const mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
	subject: String,
	content: String,
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	apartment: {								// a host will receive messages about an apartment
		type: mongoose.Schema.Types.ObjectId,
		ref: "Apartment"
	}
});


module.exports = mongoose.model("Message", messageSchema);