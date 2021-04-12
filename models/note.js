const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    userID: String,
    title: String,
    content: String,
    time: String
});


module.exports = mongoose.model("Note", NoteSchema);