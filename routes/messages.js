const express	= require("express"),
	  router	= express.Router(),
	  User	  	= require("../models/user"),
	  Apartment	= require("../models/apartment"),
	  Message 	= require("../models/message");
	  // url		= require("url");

// Show Route for tenant
router.get("/tenant/:tenant_id/:apartment", function(req,res){
	User.findById(req.params.tenant_id).populate("messages.apartment")
	.populate({ path:"messages.conversation", populate: { path: "sender recipient" }})
	.exec(function(err, tenant){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		Apartment.findById(req.params.apartment).populate("host").exec(function(err, apartment){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			var conversation = [];
			for(var mail of tenant.messages){
				if(mail.apartment._id.equals(apartment._id)){
					conversation = mail.conversation.concat([]);
					break;
				}
			}

			res.render("messages/tenant/index", { apartment: apartment, conversation: conversation,
												  host: apartment.host});
		});
	});
});


// Index Route for host
router.get("/host/:host_id/:apartment_id", function(req,res){
	User.findById(req.params.host_id).populate("apartments").populate("messages.apartment")
	.populate({ path:"messages.conversation", populate: { path: "sender recipient" }})
	.exec(function(err, host){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		var apartment = {};
		for(apartment of host.apartments){
			if(apartment._id.equals(req.params.apartment_id)){	
				break;
			}
		}

		if(Object.keys(apartment).length == 0){
			req.flash("error", "Could not find apartment.");
			return res.redirect("back");
		}

		var inbox = [];
		var sent = [];
		for(var mail of host.messages){
			if(mail.apartment._id.equals(apartment._id)){
				for(var message of mail.conversation){
					if(message.sender._id.equals(host._id)){
						sent.push(message);
					}else{
						inbox.push(message);
					}
				}
				break;
			}
		}

		res.render("messages/host/index", { apartment: apartment, inbox: inbox, sent: sent });
	});
});


// Show Route for host
router.get("/host/:host_id/:apartment_id/:message_id", function(req,res){
	Message.findById(req.params.message_id).populate("sender").populate("recipient")
	.exec(function(err, message){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		res.render("messages/host/show", { message: message, apartment: req.params.apartment_id });
	});
});

// New Route
router.get("/:user/:apartment/new", function(req,res){
	User.findById(req.params.user, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		Apartment.findById(req.params.apartment).populate("host").exec(function(err, apartment){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			var recipient = JSON.parse(req.query.recipient);

			res.render("messages/new", { sender: user, recipient: recipient,
										 apartment: apartment });
		});
	});
});


// Create Route
router.post("/:tenant/:apartment", function(req,res){
	User.findById(req.params.tenant).populate("messages.apartment").populate("messages.conversation")
	.exec(function(err, tenant){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		Apartment.findById(req.params.apartment)
		.populate({ path: "host",
				   	populate: { path: "messages", populate: { path: "apartment conversation" } } })
		.exec(function(err, apartment){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			var sender, recipient;

			if(req.query.sender == "tenant"){
				sender = tenant._id;
				recipient = apartment.host._id;
			}else{
				sender = apartment.host._id;
				recipient = tenant._id;
			}

			var message = {
				subject:	req.body.subject,
				content:	req.body.content,
				sender:		sender,
				recipient:	recipient
			};

			Message.create(message, function(err, newMessage){
				if(err){
					req.flash("error", err.message);
					return res.redirect("back");
				}

				newMessage.save();

				var updated = false;

				// Add new message in tenant's mail
				for(var mail of tenant.messages){
					if(mail.apartment._id.equals(apartment._id)){
						mail.conversation.push(newMessage);
						tenant.save();
						updated = true;
						break;
					}
				}

				if(updated == false){
					var conversation = [];
					conversation.push(newMessage);

					var mail = {
						apartment: apartment._id,
						conversation: conversation
					};

					tenant.messages.push(mail);
					tenant.save();
				}

				updated = false;

				if(tenant._id.equals(apartment.host._id) == false){
					// Add new massage in host's mail
					for(var mail of apartment.host.messages){
						if(mail.apartment._id.equals(apartment._id)){
							mail.conversation.push(newMessage);
							apartment.host.save();
							//apartment.save();
							updated = true;
							break;
						}
					}

					if(updated == false){
						var conversation = [];
						conversation.push(newMessage);

						var mail = {
							apartment: apartment._id,
							conversation: conversation
						};

						apartment.host.messages.push(mail);
						apartment.host.save();
					}
				}

				req.flash("success", "Your message was sent successfully.");
				if(req.user._id.equals(tenant._id)){
					res.redirect("/messages/tenant/" + tenant._id + "/" + apartment._id);
				}else{
					res.redirect("/messages/host/" + tenant._id + "/" + apartment._id);
				}
			});
		});
	});
});


router.delete("/:user/:apartment/:message", function(req,res){
	User.findById(req.params.user).populate("messages.apartment").populate("messages.conversation")
	.exec(function(err, foundUser){
		if(err){
			req.flash("error", err.message);
			return res.redirect("back");
		}

		Apartment.findById(req.params.apartment, function(err, apartment){
			if(err){
				req.flash("error", err.message);
				return res.redirect("back");
			}

			for(var mail of foundUser.messages){
				if(mail.apartment._id.equals(apartment._id)){
					var i = 0;
					for(var message of mail.conversation){
						if(message._id.equals(req.params.message)){
							var length = mail.conversation.length;

							// Remove message from user's conversation
							var part1 = mail.conversation.slice(0,i);
							var part2 = mail.conversation.slice(i+1,length);
							mail.conversation = part1.concat(part2);
							foundUser.save();

							var otherUser;
							if(message.sender.equals(foundUser._id)){
								otherUser = message.recipient._id;
							}else{
								otherUser = message.sender._id;
							}

							User.findById(otherUser).populate("messages.apartment")
							.populate("messages.conversation").exec(function(err, otherUser){
								if(err){
									req.flash("error", err.message);
									return res.redirect("back");
								}

								// Check if the other user has deleted this message as well
								var found = false;
								for(var mail of otherUser.messages){
									if(mail.apartment._id.equals(apartment._id)){
										for(var message of mail.conversation){
											if(message._id.equals(req.params.message)){
												found = true;
												break;
											}
										}
										break;
									}
								}

								// If both users have deleted this message,
								// it should be removed from the db as well
								if(found == false){
									Message.findByIdAndRemove(message, function(err){
										if(err){
											req.flash("error", err.message);
											return res.redirect("back");
										}

										req.flash("success", "Message was deleted successfully.");
										if(req.user._id.equals(apartment.host)){
											return res.redirect("/messages/host/" + req.params.user + "/"
														 + req.params.apartment);
										}else{
											return res.redirect("/messages/tenant/" + req.params.user + "/"
														 + req.params.apartment);
										}
									});
								}

								req.flash("success", "Message was deleted successfully.");
								if(req.user._id.equals(apartment.host)){
									return res.redirect("/messages/host/" + req.params.user + "/"
											+ req.params.apartment);
								}else{
									return res.redirect("/messages/tenant/" + req.params.user + "/"
											+ req.params.apartment);
								}
							});
							break;
						}
						i += 1;
					}
					break;
				}
			}
		});
	});
});

module.exports = router;