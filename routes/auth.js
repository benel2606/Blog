var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Register
router.get("/register", function (req, res) {
    res.render("auth/register");
});
//Sign up
router.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            //console.log(err);
            return res.render("auth/register", {
                "error": err.message
            });
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", user.username + " wSelcome to blog!");
            res.redirect("/blogs");
        });
    });
});
//Login
router.get("/login", function (req, res) {
    res.render("auth/login");
});
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }),
    function (req, res) {}
);
//Logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/blogs");
});

module.exports = router;