const mongoose = require('mongoose');

const dialpadSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: Number | String,
    values: String
})

module.exports = mongoose.model('Dialpad', dialpadSchema);