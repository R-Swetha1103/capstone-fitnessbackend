const express = require("express");
const { Bookingmodel } = require("../models/bookingModel");
const { authenticate } = require("../middlewares/authenticateMiddleware");
const nodemailer = require("nodemailer");
require("dotenv").config();

const bookingRoutes = express.Router();

bookingRoutes.get("/", async (req, res) => {
    try {
        const reqData = await Bookingmodel.find();
        res.status(200).json({ msg: "All booking data", bookingData: reqData });
    } catch (error) {
        console.log("Error getting all booking data:", error.message);
        res.status(500).json({ msg: "Error getting all booking data", errorMsg: error.message });
    }
});

bookingRoutes.get("/userId", authenticate, async (req, res) => {
    const userId = req.user._id; // Retrieve userId from req.user
    try {
        const reqData = await Bookingmodel.find({ userId });
        res.status(200).json({ msg: `All booking data for userId ${userId}`, Data: reqData });
    } catch (error) {
        console.log("Error getting particular user booking data:", error.message);
        res.status(500).json({ msg: "Error getting particular user booking data", errorMsg: error.message });
    }
});

bookingRoutes.get("/:trainerId", async (req, res) => {
    const trainerId = req.params.trainerId;
    try {
        const reqData = await Bookingmodel.find({ trainerId });
        res.status(200).json({ msg: `All booking data for trainerId ${trainerId}`, Data: reqData });
    } catch (error) {
        console.log("Error getting particular trainer booking data:", error.message);
        res.status(500).json({ msg: "Error getting particular trainer booking data", errorMsg: error.message });
    }
});

bookingRoutes.post("/create", authenticate, async (req, res) => {
    const data = req.body;
    try {
        const allBookings = await Bookingmodel.find({ trainerId: data.trainerId });

        const isSlotAvailable = allBookings.every(
            booking => booking.bookingDate !== data.bookingDate || booking.bookingSlot !== data.bookingSlot
        );

        if (!isSlotAvailable) {
            return res.status(400).json({ msg: "This Slot is Not Available." });
        }

        const addData = new Bookingmodel(data);
        await addData.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Store email in .env
                pass: process.env.EMAIL_PASSWORD // Store password in .env
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: data.userEmail,
            subject: 'Booking Confirmation from Rapid Fit',
            text: `Your Booking is confirmed on ${data.bookingDate} date at ${data.bookingSlot} slot.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error while sending confirmation mail' });
            }
            return res.status(200).json({ message: 'Confirmation sent to email', msg: "New booking created successfully" });
        });
    } catch (error) {
        console.log("Error adding new booking data:", error.message);
        res.status(500).json({ msg: "Error adding new booking data", errorMsg: error.message });
    }
});

bookingRoutes.patch("/edit/:id", async (req, res) => {
    const ID = req.params.id;
    const data = req.body;
    try {
        await Bookingmodel.findByIdAndUpdate(ID, data);
        res.status(200).json({ msg: `Booking ID ${ID} updated successfully` });
    } catch (error) {
        console.log("Error editing booking data:", error.message);
        res.status(500).json({ msg: "Error editing booking data", errorMsg: error.message });
    }
});

bookingRoutes.delete("/remove/:id", authenticate, async (req, res) => {
    const ID = req.params.id;
    try {
        await Bookingmodel.findByIdAndDelete(ID);
        res.status(200).json({ msg: `Booking ID ${ID} deleted successfully` });
    } catch (error) {
        console.log("Error deleting booking data:", error.message);
        res.status(500).json({ msg: "Error deleting booking data", errorMsg: error.message });
    }
});

module.exports = {
    bookingRoutes
};
