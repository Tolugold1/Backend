const express = require('express');
const bodyParser = require('body-parser');
const Leader = require("../Model/leader");
var authenticate = require("../authenticate");
const cors = require("./cors")

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req, res, next) => {
   Leader.find()
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, (err) => next(err))
   .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Leader.create(req.body)
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, (err) => next(err))
   .catch(err => next(err))
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   res.statusCode = 403;
   res.end("updating features for leader is disabled for the time being. We are sorry!!!")
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Leader.remove({})
   .then(resp => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(resp);
   }, err => next(err))
   .catch(err => next(err));
});

leaderRouter.route("/:leaderId")
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200)})

.get(cors.cors, (req, res, next) => {
   Leader.findById(req.params.leaderId)
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/josn");
      res.json(leader);
   }, err => next(err))
   .catch(err => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   res.statusCode = 403;
   res.end("Posting features for leader is disabled for the time being. We are sorry!!!")
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Leader.findByIdAndUpdate(req.params.leaderId, {
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

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
   Leader.findByIdAndRemove(req.params.leaderId)
   .then(leader => {
      res.statusCode = 200;
      res.header("Content-Type", "application/json");
      res.json(leader);
   }, err => next(err))
   .catch(err => next(err));
})

module.exports = leaderRouter;