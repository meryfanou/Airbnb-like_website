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
	apartement: {								// a host will receive messages about an apartement
		type: mongoose.Schema.Types.ObjectId,
		ref: "Apartement"
	}
});


module.exports = mongoose.model("Message", messageSchema);