const mongoose = require("mongoose");
const validator = require("validator");

// Define the schema for clothing items
const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field is mandatory
    minlength: 2, // Minimum length of 2 characters
    maxlength: 30, // Maximum length of 30 characters
  },
  weather: {
    type: String,
    required: true, // This field is mandatory
    enum: ["hot", "warm", "cold"], // Only accept these specific values
  },
  imageUrl: {
    type: String,
    required: true, // This field is mandatory
    validate: {
      validator(value) {
        return validator.isURL(value); // Use 'validator' library to check URL
      },
      message: "You must enter a valid URL", // Error message if validation fails
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Store the ObjectId of the user who owns the item
    ref: User, // Reference the User model
    required: true, // This field is mandatory
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  createdAt: {
    type: Date, // Store the creation date
    default: Date.now, // Automatically set the current date/time when the item is created
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
