var express = require("express"); 
var router = express.Router(); 
var passport = require("passport"); 
var User = require("../models/user");
var middleware = require("../middleware");


/// Root Route
router.get("/", function(req, res){
   res.render("landing");  
});

// New User Route
router.get("/register", function(req, res){
    res.render("register"); 
});

// Create User Route 
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message); 
            /// Short circuits to get out of callback methods 
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome To YelpCamp " + user.username);
            return res.redirect("/campgrounds"); 
        });
    });
}); 

// Show login form 
router.get("/login", function(req, res){
    res.render("login");
});

/// Handling login Logic
/// router.post("/login", middleware, callback function)
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You Logged Out"); 
   return res.redirect("/campgrounds"); 
});

module.exports = router; 