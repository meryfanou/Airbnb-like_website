const express	 = require("express"),
	  router 	 = express.Router(),
	  User   	 = require("../models/user"),
	  middleware = require("../middleware");

// ROUTES
router.get("/host", function(req,res){
	res.render("users/host");
});



module.exports = router;