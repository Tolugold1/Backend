var express = require('express');
var User = require('../Model/user');
const bodyParser = require("body-parser")
const passport = require("passport");
var router = express.Router();

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({err: err});
    } else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "Registration successful", success: true});
      });
    }
  })
});

router.post("/login", passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({success: true, message: "You are successfully logged in!."});
});


router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session_id');
    res.redirect('/');
  } else {
    var err = new Error('You are not logged!');
    err.status = 403;
    next(err);
  }
})
module.exports = router;