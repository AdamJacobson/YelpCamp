var express = require("express");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var router = express.Router({mergeParams: true});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if (error) {
            console.log(error);
        } else {
            req.flash("success", "Comment created");
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if (error) {
            console.log(error);
            res.redirect("campgrounds");
        } else {
            Comment.create(req.body.comment, function(error, createdComment){
                if (error) {
                    console.log(error);
                } else {
                    // add username and id to comment
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    // save comment
                    createdComment.save();
                    console.log(createdComment);
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success", "Comment added");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment) {
        if (error) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        if (error) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if (error) {
            console.log(error);
        }
        
        req.flash("success", "Comment deleted");
        res.redirect("back");
    });
});

module.exports = router;