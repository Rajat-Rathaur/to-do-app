

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = "secret";
// Example import statement
const User = require('../models/userModel');


const updatePasswordValidation = require("../validations/updatePasswordValidation");

const signup = async (req, res) => {
    // Extract name, email, and password from request body
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.SECRET);

        // Set the JWT token as a cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({ message: "Sign Up successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// Assuming SECRET_KEY is defined somewhere in your code as it's used for jwt.sign



const signin = async (req, res) => {

    const { email, password } = req.body;



    try {

        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {

            return res.status(404).json({ message: "User not found" });

        }



        const matchPassword = await bcrypt.compare(password, existingUser.password);



        if (!matchPassword) {

            return res.status(400).json({ message: "Invalid Email or Password" });

        }



        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" });



        // You might want to limit the user information sent back to the client for security reasons

        const userToSend = {
            name : existingUser.name,

            email: existingUser.email,

            id: existingUser._id,

            // Add any other user fields you want to send back

        };



        res.cookie("jwt", token, {

            httpOnly: true,

            maxAge: 24 * 60 * 60 * 1000, // 24 hours

        });



        // Include user and token in the response

        res.status(200).json({ user: userToSend, token: token, message: "Sign In successful" });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "Something went wrong" });

    }

};



const getById = async (req, res) => {
    try {
        const userId = req.body.id;
        const user = await User.findById(userId).select("-password");
        return res.status(200).json({ user, success: true });
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error occurred while fetching the user details: " + error.message,
            success: false,
        });
    }
};

const updateById = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById({ email });
        if (!user) {
            const user = await User.findByIdAndUpdate(req.params.id, { name, email });
            if (!user) {
                return res.status(404).json({
                    error: "User doesn't exist",
                    success: false
                });
            } else {
                return res.status(200).json({ user: { name, email }, success: true });
            }
        } else {
            return res.status(409).json({
                error: `User with email address ${email} already exists. Please provide  email address as the new email`,
                success: false
            });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error occurred while updating the user details: " + error.message,
            success: false,
        });
    }
};

const deleteById = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "Bad Request: No User found with the authenticated ID",
                success: false,
            });
        } else {
            await User.findByIdAndDelete(userId);
            return res.status(200).json({ success: true });
        }
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error while deleting the user: " + error.message,
            success: false,
        });
    }
};

const updatePassword = async (req, res) => {
    const { password, newPassword } = req.body;
    try {
        const id = req.id;
        let user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User with the given ID doesn't exist", success: false });
        } else if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Old password doesn't match with the provided password", success: false });
        } else if ((await bcrypt.compare(newPassword, user.password))) {
            return res.status(400).json({ error: "New password can't be same as old password", success: false });
        } else {
            await updatePasswordValidation(req, res, async () => {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(newPassword, salt);
                user.password = hash;

                const newUser = await user.save();
                return res.status(200).json({ message: "Password Change Successfully", success: true });
            });
        }
    } catch (error) {
        return res.status(500).json({ error: "Password Change Unsuccessfull" + error.message, success: false });
    }
};

module.exports = { signup, signin, getById, updateById, deleteById, updatePassword }
