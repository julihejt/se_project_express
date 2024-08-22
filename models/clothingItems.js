const mongoose = require("mongoose");
const clothingItemSchema = new mongoose.Schema({});

module.exports = mongoose.model("item", clothingItemSchema);
