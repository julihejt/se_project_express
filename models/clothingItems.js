// Import mongoose for schema creation and validator for URL validation
const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./user"); // Import the User model to reference user documents

// Define the schema for clothing items
const clothingItemSchema = new mongoose.Schema({
  // Name of the clothing item, required with minimum and maximum length validation
  name: {
    type: String,
    required: true, // This field is mandatory
    minlength: 2, // Minimum length of 2 characters
    maxlength: 30, // Maximum length of 30 characters
  },
  // Weather type for the clothing item, required and must be one of three values: "hot", "warm", or "cold"
  weather: {
    type: String,
    required: true, // This field is mandatory
    enum: ["hot", "warm", "cold"], // Only accept these specific values
  },
  // URL of the item's image, required and validated using the 'validator' library to ensure it's a valid URL
  imageUrl: {
    type: String,
    required: true, // This field is mandatory
    validate: {
      // Custom validator to check if the string is a valid URL
      validator(value) {
        return validator.isURL(value); // Use 'validator' library to check URL
      },
      message: "You must enter a valid URL", // Error message if validation fails
    },
  },
  // The owner of the item, which references a User document by ObjectId
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Store the ObjectId of the user who owns the item
    ref: User, // Reference the User model
    required: true, // This field is mandatory
  },
  // An array of users who like the item, defaulting to an empty array
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Store ObjectIds of users who like the item
      ref: "user", // Reference the User model
      default: [], // Initialize with an empty array
    },
  ],
  // The date when the item was created, defaults to the current date/time
  createdAt: {
    type: Date, // Store the creation date
    default: Date.now, // Automatically set the current date/time when the item is created
  },
});

// Export the clothingItem model for use in other parts of the application
module.exports = mongoose.model("clothingItem", clothingItemSchema);
