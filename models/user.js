const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // Password is excluded from query results by default
  },
});

// Hash password before saving
//userSchema.pre("save", async function (next) {
//if (this.isModified("password")) {
//this.password = await bcrypt.hash(this.password, 10);
//}
//next();
//});

// Find user by credentials for authentication
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password") // Include password for authentication
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
