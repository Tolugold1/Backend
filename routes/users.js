var express = require('express');
var User = require('../Model/user');
const bodyParser = require("body-parser")
const passport = require("passport");
const authenticate = require("../authenticate")
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get("/", authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((user) => {
    if (!user) {
      err = new Error("There's no registered user. User emoty!!!")
      err.status = 404;
      return next(err);
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({success: true, status: "User present!", user: user});
    }
  })
})

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({err: err});
    } else {
      if (req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if (req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({err: err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ status: "Registration successful", success: true});
        });
      })
    }
  })
});

router.post("/login", passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({success: true, Token: token, message: "You are successfully logged in!."});
});


/* router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session_id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged!');
    err.status = 403;
    next(err);
  }
}) */

module.exports = router;
