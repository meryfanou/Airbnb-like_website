const express	 = require("express"),
	  router 	 = express.Router(),
	  User   	 = require("../models/user"),
	  middleware = require("../middleware");

// ROUTES
router.get("/:id/host", function(req,res){
	User.findById(req.params.id,).populate("apartements").exec(function(err, foundUser){
	 	if(err){
	 		req.flash("error", err.message);
	 		res.redirect("back");
	 	}else if(!foundUser){
	 		req.flash("error", "User not found");
			res.redirect("back");
	 	}else{
	 		res.render("users/host", {apartements: foundUser.apartements});
	 	}
	 });
});



module.exports = router;