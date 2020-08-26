const express = require("express"),
	  router = express.Router(),
	  Apartement = require("../models/apartement");

// New Route
router.get("/new", function(req,res){
	res.render("apartements/new");
});

module.exports = router;