const mongoose = require("mongoose")

const librarySchema = mongoose.Schema({
    userId: {type: String, required: true},
    library: {type: mongoose.Schema.Types.Mixed, required: true},
})


module.exports = mongoose.model("Library", librarySchema);