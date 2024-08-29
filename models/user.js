// Import mongoose for creating the schema and validator for validating URLs
const mongoose = require("mongoose");
const validator = require("validator");

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // The user's name, required with minimum and maximum length validation
  name: {
    type: String,
    required: true, // Name field is mandatory
    minlength: 2, // Minimum length of 2 characters
    maxlength: 30, // Maximum length of 30 characters
  },
  // URL of the user's avatar, required and validated to ensure it's a valid URL
  avatar: {
    type: String,
    required: true, // Avatar field is mandatory
    validate: {
      // Custom validator to check if the string is a valid URL
      validator(value) {
        return validator.isURL(value); // Use 'validator' library to validate URLs
      },
      message: "You must enter a valid URL", // Error message if validation fails
    },
  },
});

// Export the User model to be used in other parts of the application
module.exports = mongoose.model("user", userSchema);
