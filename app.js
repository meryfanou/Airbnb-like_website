require("dotenv").config();

const express		 = require("express"),
	  app			 = express(),
	  bodyParser	 = require("body-parser"),
	  mongoose		 = require("mongoose"),
	  flash			 = require("connect-flash"),
	  passport		 = require("passport"),
	  localStradegy  = require("passport-local"),
	  methodOverride = require("method-override"),
	  fs			 = require("fs"),
	  https			 = require("https"),
	  User			 = require("./models/user"),
	  Message		 = require("./models/message"),
	  Apartment		 = require("./models/apartment");

var userRoutes		  = require("./routes/users"),
	messageRoutes	  = require("./routes/messages"),
	apartmentRoutes   = require("./routes/apartments"),
	indexRoutes		  = require("./routes/index"),
	searchRoutes	  = require("./routes/search"),
	reservationRoutes = require("./routes/reservations"),
	reviewsRoutes	  = require("./routes/reviews");

var port = process.env.PORT || 3000,
	db_url = process.env.DATABASEURL || "mongodb://localhost/airbnb";

mongoose.connect(db_url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
.then(() => console.log("Connected to Airbnb db"))
.catch(error => console.log(error.message));


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));		//__dirname is the directory name where the script runs
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Renting App",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStradegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	// req.user is object with info about the currently logged in user (if there is one)
	res.locals.currentUser = req.user;
	// If there's anything in the flash, we'll have access to it in any template under var message
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	next();
});

app.use("/users", userRoutes);
app.use("/users/:id/messages", messageRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/", indexRoutes);
app.use("/search", searchRoutes);
app.use("/reservations", reservationRoutes);
app.use("/reviews",reviewsRoutes);

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app);

app.listen(port, function(){
	console.log("Airbnb server has started");
});