const express = require('express');
const bodyParser = require('body-parser');
const Promotion = require("../Model/promotions");
var authenticate = require("../authenticate");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')

.get((req, res, next) => {
   Promotion.find()
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, (err) => next(err))
   .catch(err => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
   Promotion.create(req.body)
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, (err) => next(err))
   .catch(err => next(err))
})

.put(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end("updating features for leader is disabled for the time being. We are sorry!!!")
})

.delete(authenticate.verifyUser, (req, res, next) => {
   Promotion.remove({})
   .then(resp => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(resp);
   }, err => next(err))
   .catch(err => next(err));
});

promotionRouter.route("/:promotionId")

.get((req, res, next) => {
   Promotion.findById(req.params.promotionId)
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/josn");
      res.json(promotion);
   }, err => next(err))
   .catch(err => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end("Posting features for leader is disabled for the time being. We are sorry!!!")
})

.put(authenticate.verifyUser, (req, res, next) => {
   Promotion.findById(req.params.promotionId, {
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

.delete(authenticate.verifyUser, (req, res, next) => {
   Promotion.remove(req.params.promotionId)
   .then(promotion => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(promotion);
   }, err => next(err))
   .catch(err => next(err));
})

module.exports = promotionRouter;