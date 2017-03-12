var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"), 
    mongoose                = require("mongoose"),
    seedDB                  = require("./seeds"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    User                    = require("./models/user"),
    expressSession          = require("express-session"),
    methodOverried          = require("method-override"),
    flash                   = require("connect-flash");
    
// ROUTES
var commentRoutes           = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    indexRoutes             = require("./routes/index");

mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverried("_method"));
app.use(flash());

seedDB();

// PASSPORT CONFIG
app.use(expressSession({
    secret: "VgVuIVtPlrTIC2Elgs4QOFK77tpwztjopUnyhGa2CmLeyOiz0unSq05XDu8e6udv",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// current user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Routes
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// LISTENER
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Listening on port " + process.env.PORT + " with IP " + process.env.IP);
});