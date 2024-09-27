const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();

const { Signupmodel } = require("../models/signupModel");

const signupRoute = express.Router();

// Registering new user
signupRoute.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await Signupmodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "You are already registered!" });
        }

        const hash = await bcrypt.hash(password, 10); // Increased salt rounds
        const newUser = new Signupmodel({ name, email, password: hash });
        await newUser.save();
        res.status(201).json({ msg: "Signup Successfully" });
    } catch (error) {
        console.error("Error from signup route:", error.message);
        res.status(500).json({ err: "Something went wrong!" });
    }
});

// Login the user
signupRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Signupmodel.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Wrong Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Wrong Credentials" });
        }

        const normal_token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email },
            process.env.normalToken,
            { expiresIn: "1d" }
        );

        const refresh_token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email },
            process.env.refreshToken,
            { expiresIn: "7d" }
        );

        res.json({
            msg: "Login Successful",
            token: normal_token,
            refreshToken: refresh_token,
            name: user.name
        });
    } catch (error) {
        console.error("Error from login route:", error.message);
        res.status(500).json({ err: "Something went wrong!" });
    }
});

// Logout the user
signupRoute.get("/logout", (req, res) => {
    const token = req.headers.authorization;

    try {
        if (!token) {
            return res.status(400).json({ msg: "No token provided!" });
        }

        const blacklistingToken = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));
        blacklistingToken.push(token);
        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistingToken));
        res.json({ msg: "Logged out!" });
    } catch (error) {
        console.error("Error from logout route:", error.message);
        res.status(500).json({ err: "Something went wrong!" });
    }
});

// To get new token
signupRoute.get("/newtoken", async (req, res) => {
    const refreshToken = req.headers.authorization;

    try {
        if (!refreshToken) {
            return res.status(401).json({ msg: "Please login first!" });
        }

        jwt.verify(refreshToken, process.env.refreshToken, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Please login again!", err: err.message });
            }

            const userData = await Signupmodel.findById(decoded.userId);
            if (!userData) {
                return res.status(404).json({ msg: "User not found" });
            }

            const normalToken = jwt.sign(
                { userId: userData._id, name: userData.name, email: userData.email },
                process.env.normalToken,
                { expiresIn: "1d" }
            );

            res.json({ msg: "Token refreshed successfully", token: normalToken });
        });
    } catch (error) {
        console.error("Error from getting new token route:", error.message);
        res.status(500).json({ err: "Something went wrong!" });
    }
});

// Get all users
signupRoute.get("/alluser", async (req, res) => {
    try {
        const userData = await Signupmodel.find();
        res.json(userData);
    } catch (error) {
        console.error("Error while fetching user data:", error.message);
        res.status(500).json({ err: "Something went wrong!" });
    }
});

module.exports = {
    signupRoute
};
