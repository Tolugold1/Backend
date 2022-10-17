const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./Model/user");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const config = require("./config");
const Dishes = require("./Model/dishes")

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

const opt = {};
opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opt, (jwt_payload, done) => {
    console.log("jwt_payload", jwt_payload);

    User.findOne({_id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        } else if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
}))

exports.verifyUser = passport.authenticate("jwt", {session: false});

/* exports.verifyAdmin = function(user, req, res, next) {
    console.log(user.admin)
    if (user.admin === true) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({success: true, msg: "Your qualified"})
    } else if (user === false) {
        err = new Error("Sorry!, you are not registered yet. please try again later.");
        err.status = 401;
        next(err);
    }
} */

/* exports.verifyAdmin = (req, res, next) => {
    User.findOne({_id: req.body._id})
    .then((user) => {
        console.log(req.user)
        console.log(user.admin)
        console.log(user._id)
    })
} */


exports.verifyAdmin = (req, res, next) => {
    User.findOne({_id: req.body._id})
    .then((user) => {
        if (req.user.admin === true) {
            Dishes.remove({})
            .then(resp => {
                console.log("Dishes deleted successfully!");
                res.statusCode = 200;
                res.header("Content-Type", "application/json")
                res.json({status: "You are authorize because you are an admin user",responce: resp});
            }, (err) => next(err))
        } else {
            err = new Error("Sorry!, you are not an admin user.");
            err.status = 401;
            next(err);
        }
    })
}