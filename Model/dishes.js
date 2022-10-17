const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose)
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
     },
     author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     }
  }, {
     timestamps: true
})

const dishSChema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type:String,
        required: true,
    },
    category: {
        type:String,
        required: true,
    },
    label: {
        type:String,
        required: true,
    },
    price: {
        type: Currency,
        required: true,
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments: [ commentSchema ]
}, {
    timestamps:true
})

const Dishes = mongoose.model("Dish", dishSChema);

module.exports = Dishes;