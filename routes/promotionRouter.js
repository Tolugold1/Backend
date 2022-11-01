const express = require('express');
const bodyParser = require('body-parser');
const Promotion = require("../Model/promotions");
var authenticate = require("../authenticate");
const cors = require("./cors")

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req, res, next) => {
   Promotion.find()
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, (err) => next(err))
   .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Promotion.create(req.body)
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, (err) => next(err))
   .catch(err => next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   res.statusCode = 403;
   res.end("updating features for leader is disabled for the time being. We are sorry!!!")
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Promotion.remove({})
   .then(resp => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(resp);
   }, err => next(err))
   .catch(err => next(err));
});

promotionRouter.route("/:promotionId")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req, res, next) => {
   Promotion.findById(req.params.promotionId)
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/josn");
      res.json(promotion);
   }, err => next(err))
   .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   res.statusCode = 403;
   res.end("Posting features for leader is disabled for the time being. We are sorry!!!")
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Promotion.findByIdAndUpdate(req.params.promotionId, {
      $set: req.body }, {
         new: true
      }
   )
   .then(promotion => {
      res.statusCode= 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, (err) => next(err))
   .catch(err => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Promotion.findByIdAndRemove(req.params.promotionId)
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, err => next(err))
   .catch(err => next(err));
})

module.exports = promotionRouter;