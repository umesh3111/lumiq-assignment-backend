const mongoose = require('mongoose');

const superheroSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String
})

module.exports = mongoose.model('Superhero', superheroSchema);