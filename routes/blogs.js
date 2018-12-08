var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");

router.get("/", function (req, res) {
    res.redirect("/blogs");
});
//INDEX
router.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("MongoDB ERROR!");
        } else {
            res.render("blogs/index", {
                blogs: blogs,
                currentUser: req.user
            });
        }
    });
});
//NEW
router.get("/blogs/new", isLoggedIn, function (req, res) {
    res.render("blogs/new");
});
//CREATE
router.post("/blogs", isLoggedIn, function (req, res) {
    var title = req.body.blog.title;
    var image = req.body.blog.image;
    var body = req.body.blog.body;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    //req.body.blog
    var newObjBlog = {
        title: title,
        image: image,
        body: body,
        author: author
    }
    Blog.create(newObjBlog, function (err, newBlog) {
        if (err) {
            res.render("blogs/new");
        } else {
            res.redirect("/blogs");
        }
    });
});
//SHOW
router.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id)
        .populate("comments")
        .exec(function (err, foundBlog) {
            if (err) {
                res.redirect("/blogs");
            } else {
                res.render("blogs/show", {
                    blog: foundBlog
                });
            }
        });
});
//EDIT
router.get("/blogs/:id/edit", checkPostAuthorAndLoggedIn, function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("blogs/edit", {
                blog: foundBlog
            });
        }
    });
});
//UPDATE
router.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (
        err,
        updatedBlog
    ) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//DELETE
router.delete("/blogs/:id", checkPostAuthorAndLoggedIn, function (req, res) {
    Blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkPostAuthorAndLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, function (err, foundBlog) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;