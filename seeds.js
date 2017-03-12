var mongodb = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

var data = [
    {
        name: "Carrot Hill",
        image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
        description: lorem,
        price: 3.50
    },
    {
        name: "Starry Lake",
        image: "https://farm7.staticflickr.com/6186/6090714876_44d269ed7e.jpg",
        description: lorem,
        price: 7.99
    },
    {
        name: "Yosemite",
        image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg",
        description: lorem,
        price: 12.00
    },
];

function seedDB() {
    // remove all campgrounds
    Campground.remove({}, function(error){
        if (error) {
            console.log(error);
        } else { 
            console.log("Removed all campgrounds");
            
            // Create seed data
            data.forEach(function(data){
                Campground.create(data, function(error, createdCampground){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("added a campground");
                        // Create a comment
                        Comment.create({
                            text: "This place is greate but needs WiFi",
                            author: "Rick"
                        }, function(error, createdComment){
                            if (error) {
                                console.log(error);
                            } else {
                                createdCampground.comments.push(createdComment);
                                createdCampground.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;