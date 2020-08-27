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


router.get("/:id/edit",function(req,res){
	
	User.findById(req.params.id, function(err, foundUser){
		
		if(err){
			req.flash("error",err.message);
			res.redirect("/");
		}
		else {

			res.render("users/edit", {user: foundUser});
		}
	});
});

	
router.put("/:id",function(req,res){
	
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser){
		if(err){
			req.flash("error", err.message);
			res.redirect("/");
		}else{
			
			req.flash("success","Profile updated succesfully! Please login again.");
			res.redirect("/login" );
		}
	});
	
	
});

module.exports = router;