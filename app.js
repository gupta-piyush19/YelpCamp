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
        seedDB          = require("./seeds");
        Comment         = require("./models/comment");

// requiring routes
const   commentRoutes   = require("./routes/comments");
        campgroundRoutes= require("./routes/campgrounds");
        authRoutes      = require("./routes/index");

mongoose.connect("mongodb+srv://shinchan:piyush0_0@yelpcamp.ytcjk.mongodb.net/<dbname>?retryWrites=true&w=majority",{useNewUrlParser: true ,useUnifiedTopology: true, useFindAndModify: false });
// mongoose.connect("mongodb://localhost/yelp_calmV11" ,{useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false });

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

let port = 8000 || process.env.PORT
app.listen(port,process.env.IP,function(){
    console.log("YelpCalm has started on port : 8000");
});