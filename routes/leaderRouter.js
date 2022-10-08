const express = require('express');
const bodyParser = require('body-parser');
const Leader = require("../Model/leader")

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')


.get((req, res, next) => {
   Leader.find()
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, (err) => next(err))
   .catch(err => next(err));
})

.post((req, res, next) => {
   Leader.create(req.body)
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, (err) => next(err))
   .catch(err => next(err))
})

.put((req, res, next) => {
   res.statusCode = 403;
   res.end("updating features for leader is disabled for the time being. We are sorry!!!")
})

.delete((req, res, next) => {
   Leader.remove({})
   .then(resp => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(resp);
   }, err => next(err))
   .catch(err => next(err));
});

leaderRouter.route("/:leaderId")

.get((req, res, next) => {
   Leader.findById(req.params.leaderId)
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/josn");
      res.json(leader);
   }, err => next(err))
   .catch(err => next(err));
})

.post((req, res, next) => {
   res.statusCode = 403;
   res.end("Posting features for leader is disabled for the time being. We are sorry!!!")
})

.put((req, res, next) => {
   Leader.findById(req.params.leaderId, {
      $set: req.body }, {
         new: true
      }
   )
   .then(leader => {
      res.statusCode= 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, (err) => next(err))
   .catch(err => next(err))
})

.delete((req, res, next) => {
   Leader.remove(req.params.leaderId)
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, err => next(err))
   .catch(err => next(err));
})

module.exports = leaderRouter;