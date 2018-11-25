var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  Blog = require("./models/blogs.js"),
  Comment = require("./models/comments.js"),
  User = require("./models/user.js"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  path = require("path");

var blogRoutes = require("./routes/blogs.js"),
  commentRoutes = require("./routes/comments.js"),
  authRoutes = require("./routes/auth.js");

//App config
mongoose.connect(
  "mongodb://benel2606:ba260692@benelaharon-shard-00-00-qwtgk.mongodb.net:27017,benelaharon-shard-00-01-qwtgk.mongodb.net:27017,benelaharon-shard-00-02-qwtgk.mongodb.net:27017/Blog?ssl=true&replicaSet=BenelAharon-shard-0&authSource=admin&retryWrites=true", {
    useNewUrlParser: true
  }
);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(methodOverride("_method"));

//Passport config
app.use(
  require("express-session")({
    secret: "Benel Aharon",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(blogRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, function () {
  console.log("SERVER IS RUNNING!");
});