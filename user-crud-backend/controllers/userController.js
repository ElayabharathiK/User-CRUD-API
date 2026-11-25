import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createUser = async (req, res) => {
    try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Please provide name, email and password"
                });
            }

            const errors = [];

            if (password.length < 8) {
                errors.push("At least 8 characters");
            }

            if (!/[A-Z]/.test(password)) {
                errors.push("At least one uppercase letter");
            }

            if (!/[a-z]/.test(password)) {
                errors.push("At least one lowercase letter");
            }

            if (!/[0-9]/.test(password)) {
                errors.push("At least one number");
            }

            if (!/[^A-Za-z0-9]/.test(password)) {
                errors.push("At least one special character");
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    message: "Password must contain:",
                    errors
                });
            }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User created successfully!",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        console.error("Create user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully!"
        });
    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }

};

