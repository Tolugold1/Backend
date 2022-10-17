var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Dishes = require("../Model/dishes");
var authenticate = require("../authenticate");
var auth = require("../authAdmin")


const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route("/")

.get((req, res, next) => {
    Dishes.find()
    .populate("comments.author")
    .then(dishes => {
        console.log('Found dishes');
        res.statusCode = 200;
        res.header('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch(err => next(err))
})

.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.create(req.body)
    .then(dish => {
        console.log("Dish created successfully!", dish);
        res.statusCode = 200;
        res.header("Content-Type", "application/json");
        res.json(dish);
    }, (err) => next(err))
    .catch(err => next(err))
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("This method is not supported by the server yet.")
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin)


dishRouter.route("/:dishId")
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(dishes => {
        console.log('Found dishes');
        res.statusCode = 200;
        res.header('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch(err => next(err))
})

.post(authenticate.verifyUser, (req, res, next) => {
    
    res.statusCode = 403;
    res.end("Post method not allowed")
})

.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body }, {
            new: true
        }
    )
    .then(dishes => {
        console.log('Found dishes');
        res.statusCode = 200;
        res.header('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch(err => next(err))
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(resp => {
        console.log("Dishes deleted successfully!");
        res.statusCode = 200;
        res.header("Content-Type", "application/json")
        res.json(resp);
    }, (err) => next(err))
    .catch(err => next(err))
})

dishRouter.route("/:dishId/comments")
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(dishes => {
        if (dishes != null) {
            console.log('Found dishes');
            res.statusCode = 200;
            res.header('Content-Type', 'application/json');
            res.json(dishes.comments);
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

.post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if (dish != null) {
            req.body.author = req.user._id;
            dish.comments.push(req.body)
            dish.save()
            .then(dish => {
                Dishes.findById(dish._id)
                .populate("comments.author")
                .then((dish) => {
                    res.statusCode = 200;
                    res.header('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err))
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if (dish != null) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
                dish.save()
                .then(resp => {
                    res.statusCode = 200;
                    res.header("Content-Type", "application/json");
                    res.json(resp);
                }, (err) => next(err));
            }
        } else  {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

dishRouter.route("/:dishId/comments/:commentId")
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .populate("comments.author")
    .then(dishes => {
        if (dishes != null && dishes.comments.id(req.params.commentId) != null) {
            console.log('Found dishes');
            res.statusCode = 200;
            res.header('Content-Type', 'application/json');
            res.json(dishes.comments.id(req.params.commentId));
        } else if (dishes == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);  
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})

.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dishes => {
        if (dishes != null && dishes.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dishes.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dishes.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dishes.save()
            .then(dishes => {
                Dishes.findById(dishes._id)
                .populate("comments.author")
                .then((dishes) => {
                    res.statusCode = 200;
                    res.header('Content-Type', 'application/json');
                    res.json(dishes);
                })
            }, (err) => next(err))
        } else if (dishes == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);  
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then(dish => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then(resp => {
                    Dishes.findById(dish._id)
                    .populate("comments.author")
                    .then((dish) => {
                        res.statusCode = 200;
                        res.header("Content-Type", "application/json");
                        res.json(resp);
                    })
                }, (err) => next(err));
        } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);
        } else {
            err = new Error('Dish ' + req.params.dishId + ' not found')
            err.status = 404
            return next(err);  
        }
    }, (err) => next(err))
    .catch(err => next(err))
})

module.exports = dishRouter;