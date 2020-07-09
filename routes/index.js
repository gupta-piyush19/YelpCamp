var express     = require("express");
    router      = express.Router();
    passport    = require("passport");
    User        = require("../models/user")


// Root route
router.get("/",function(req,res){
    res.render("front");
});

// show register form
router.get("/register",function(req,res){
    res.render("register");
});

// handle signup logic
router.post("/register",function(req,res){
    var newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            req.flash("error" , err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campground");
        });
    });
});

// show login form
router.get("/login",function(req,res){
    res.render("login");
});

// handling login logic 
//      router.post(url , middleware , callback)
router.post("/login", passport.authenticate("local",{
        successRedirect : "/campground",
        failureRedirect : "/login"
    }),function(req,res){
});

// logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campground");
});

module.exports = router;
