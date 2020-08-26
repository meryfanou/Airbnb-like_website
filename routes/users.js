const express	 = require("express"),
	  router 	 = express.Router(),
	  User   	 = require("../models/user"),
	  middleware = require("../middleware");

// ROUTES
router.get("/:id/host", function(req,res){
	req.user.populate("apartements","messages");
	res.render("users/host", {apartements: req.user.apartements, messages: req.user.messages});
});



module.exports = router;