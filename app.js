const   express         = require('express');
        app             = express();
        bodyParser      = require('body-parser');
        mongoose        = require("mongoose");
        flash           = require("connect-flash");
        passport        = require("passport");
        LocalStrategy   = require("passport-local");
        methodOverride  = require("method-override");
        Campground      = require("./models/campground");
        User            = require("./models/user");
        Comment         = require("./models/comment");
        // seedDB          = require("./seeds");

// requiring routes
const   commentRoutes   = require("./routes/comments");
        campgroundRoutes= require("./routes/campgrounds");
        authRoutes      = require("./routes/index");


// mongoose.connect(process.env.DATABASEURL,{useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect("mongodb+srv://shinchan:abcd1234@yelpcamp.ytcjk.mongodb.net/YelpCamp?retryWrites=true&w=majority",{useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect("mongodb://localhost/yelp_calmV11" ,{useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false });

let url = process.env.DATABASEURL || "mongodb://localhost/yelp_calmV11"; // fallback in case global var not working
mongoose.connect(url, {useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false });

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "Shinchan",
    resave : false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE - THIS FUNCTION EXECUTES BEFORE ANY ROUTE'S CALL
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campground",campgroundRoutes);
app.use("/campground/:id/comments",commentRoutes);

// let port = 8000 || process.env.PORT
app.listen(process.env.PORT || 8000,process.env.IP,function(){
    console.log("YelpCalm has started on port : 8000");
});