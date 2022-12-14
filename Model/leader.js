const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required:true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: Currency,
        required: true
    },
    features: {
        type: String,
        Boolean: true
    },
    description: {
        type: String,
        required: true
    }
})

const Leaders = mongoose.model("Leader", leaderSchema);

module.exports = Leaders;
