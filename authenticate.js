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


exports.verifyAdmin = (req, res, next) => {
    User.findOne({_id: req.body._id})
    .then((user) => {
        if (req.user.admin === true) {
            next()
        } else {
            err = new Error("Sorry!, you are not an admin user.");
            err.status = 401;
            next(err);
        }
    })
}


exports.NotAllowed = (req, res, next) => {
    User.findOne({_id: req.body._id})
    .then((user) => {
        if (req.user._id) {
            res.json("Sorry!, no user is allowed to execute this request.");
        } else {

            err = new Error("Sorry!, you are not registered.");
            err.status = 401;
            next(err);
        }
    })
}

exports.verifyOwner = (req, res, next) => {
    User.findOne(req.user._id)
    .then(() => {
        Dishes.findById(req.params.dishId)
        .then((dish) => {
            for (var i = 0; i < dish.comments.length - 1; i++) {
                console.log(typeof dish.comments[i].author, dish.comments[i].author);
                console.log(typeof req.user._id, req.user._id)
                if (req.user._id == dish.comments[i].author)
                {
                    next();
                } else {
                    err = new Error("This is not your comment");
                    err.status = 401;
                    return next(err);
                }
            }
        });
    });
}