var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var router = express.Router();

// ROOT
router.get("/", function(req, res){
    res.render("landing");
});

// REGISTER
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, createdUser){
        if (error) {
            res.render("register", {"error": error.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + createdUser.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});


var loginMiddleware = {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
};
router.post("/login", passport.authenticate("local", loginMiddleware), function(req, res) {
});

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged out.");
   res.redirect("/campgrounds");
});

module.exports = router;