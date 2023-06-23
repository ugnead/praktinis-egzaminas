const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Controller function for creating a new user
exports.registerUser = async (req, res) => {
    try {
        console.log("Register user called");
        const { username, email, password } = req.body;

        // Check if the username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }],
        });
        if (existingUser) {
            return res
                .status(409)
                .json({ message: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with the newly created user object
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
};

// Controller function for user login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user._id }, "labai6lapta=inut4");

        // Include the token in the response
        res.status(200).json({
            message: "Login successful",
            token,
            username: user.username,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error during login" });
    }
};

exports.authenticate = (req, res, next) => {
    try {
        // Retrieve the token from the request header
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        // Verify and decode the token
        const decodedToken = jwt.verify(token, "labai6lapta=inut4");

        // Extract the user ID from the decoded token and add it to the request object
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
