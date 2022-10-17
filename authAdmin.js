const User = require("./Model/user");

/* exports.verifyAdmin = (req, res, next) => {
    User.findOne({_id: req.body._id})
    .then((user) => {
        console.log(req.user._id)
        console.log(req.user.admin)
        if (req.user.admin === true) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({success: true, msg: "Your qualified"})
        } else {
            err = new Error("Sorry!, you are not an admin user.");
            err.status = 401;
            next(err);
        }
    })
} */