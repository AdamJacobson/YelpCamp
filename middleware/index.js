var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var loginRequired = "You need to be logged in to do that."
var notAuthorized = "You do not have permission to do that."

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", loginRequired);
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // owner of the campground?
        Campground.findById(req.params.id, function(error, foundCampground){
            if (error) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // does user author of the campground?
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", notAuthorized);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", loginRequired);
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // owner of the comment?
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if (error) {
                res.redirect("back");
            } else {
                // is user author of the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", notAuthorized);
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", loginRequired);
        res.redirect("back");
    }
};

module.exports = middlewareObj;