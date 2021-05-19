const mongoose = require('mongoose')

const model = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    favId: {
        type: String,
        required: true
      },
    category: {
        type: String,
        required: true
    },
});

module.exports = new mongoose.model("Fav", model)