const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./Model/user");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwtStrategy = require("passport-jwt").Strategy;
const jwt = require("jsonwebtoken");
const config = require("./config")

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