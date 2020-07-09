var express     = require("express");
    router      = express.Router({mergeParams: true});
    Campground  = require("../models/campground");
    Comment     = require("../models/comment");
    middleware  = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn ,function(req,res){
    // find campground by id
    Campground.findById(req.params.id , function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground : campground});
        }
    });
});


// Comments Create
router.post("/",middleware.isLoggedIn,function(req,res){
    // lookup comment using id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campground");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error", "something went wrong")
                }
                else{
                    //add username and id to the comment.
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success" , "Successfully added comment");
                    res.redirect("/campground/" + campground._id);
                }
            });
        }
    });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit", {campground_id : req.params.id, comment : foundComment});
            }
        });
    });
});

// COMMENT UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campground/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success" , "Comment deleted");
            res.redirect("/campground/" + req.params.id);
        }
    });
});


module.exports = router;
