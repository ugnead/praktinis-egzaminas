const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    procedures: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: "Procedure" }]
});

// Create the User model
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
