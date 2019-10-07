var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object, similar to a Sequelize model
var NoteSchema = new Schema({
    
    // Associated article to attach the note to
    _headlineId:{
        type: Schema.Types.ObjectId,
        ref: "Headline"
    },

  // 'date' is a type of string
  date: String,

  // `noteText` is of type String
  noteText: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;