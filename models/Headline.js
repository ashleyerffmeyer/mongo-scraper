var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new HeadlineSchema object
// This is similar to a Sequelize model
var HeadlineSchema = new Schema({

    // `headline` is required and of type String
    headline: {
        type: String,
        required: true,
        unique: true
    },

    // `summary` is required and of type String
    summary: {
        type: String,
        required: true
    },

    // 'date is a string and saved with the type and default properties
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Headline", HeadlineSchema);

// Export the Article model
module.exports = Headline;
