var express = require("express");
var Campground = require("../models/campground");
var middleware = require("../middleware");
var router = express.Router();

// INDEX
router.get("/", function(req, res){
    Campground.find({}, function(error, allCampgrounds){
        var data = {campgrounds: allCampgrounds};
        
        if (error) {
            console.log(error);
        } else {
            res.render("campgrounds/index", data);
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.campground, function(error, createdCampground){
        if(error) {
            console.log(error);
        } else {
            createdCampground.author = author;
            createdCampground.save();
            
            req.flash("success", "Campground created");
            res.redirect("/campgrounds");
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if(error) {
            console.log(error);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if (error) {
            req.flash("error", "Couldn't find that campground.");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updateCampground){
        if (error) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        if (error) {
            console.log(error);
        }
        
        req.flash("success", "Campground deleted");
        res.redirect("/campgrounds")
    });
});

module.exports = router;