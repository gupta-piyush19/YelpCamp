const   express     = require("express");
        router      = express.Router();
        Campground  = require("../models/campground");
        middleware  = require("../middleware");

// Campground page  -------- INDEX - show all campgrounds
router.get("/",function(req,res){
    // GET all campground from DB = yelp_calm
    Campground.find({}, function(err,allCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampground});
        }
    });
});


// CREATE - Add new campground to DB
router.post("/",middleware.isLoggedIn,function(req,res){
    // get data from form and add it to campground array
    // redirect to campground page
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name : name, image : image , price : price, description : desc, author : author};
        // Create a new campground and save it to DB
    Campground.create(newCampground, function(err,newcamp){
        if(err){
            console.log(err);
        }
        else{
            // redirect to campgrounds page 
            res.redirect("/campground");
        }
    })
});

// NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// SHOW - show more about a campground
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }
        else{
        // render show template with that campground
            // using below statement we can access particular campground associated with that id in show template page...
        res.render("campgrounds/show" , {campground : foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        if(err){
          res.redirect("/campground");
        }else{
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });    
});
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campground");
        }
        else{
            res.redirect("/campground/" + req.params.id);
        }
    });
    // redirect to campground show page
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id/delete",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campground");
            console.log(err);
        }
        else{
            res.redirect("/campground");
        }
    });
});
// middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;