const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require("../authenticate")
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        cb(new Error("Ivalid image file, uplaod a jpeg/png/git/jpg image file", false));
    } else {
        cb(null, true);
    }
}

const upload = multer({storage: storage, fileFilter: imageFileFilter})

const uplaodRouter = express();

uplaodRouter.use(bodyParser.json());

uplaodRouter.route('/')

.get(authenticate.verifyUser, authenticate.NotAllowed, (req, res, next) => {
    res.statusCode = 403;
    res.end("This method is not supported by the server.")
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file)
})

.put(authenticate.verifyUser, authenticate.NotAllowed, (req, res, next) => {
    res.statusCode = 403;
    res.end("This method is not supported by the server.")
})

.delete(authenticate.verifyUser, authenticate.NotAllowed, (req, res, next) => {
    res.statusCode = 403;
    res.end("This method is not supported by the server.")
})

module.exports = uplaodRouter;