const express = require("express");
const mongoose = require("mongoose");
const { TrainerModel } = require("../models/trainerModel");

const trainerRouter = express.Router();

// Get all trainers
trainerRouter.get("/", async (req, res) => {
    try {
        const trainerData = await TrainerModel.find();
        res.json(trainerData);
    } catch (error) {
        console.error("Error while fetching trainer data:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Get trainer by ID
trainerRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const trainerData = await TrainerModel.findById(id);
        if (!trainerData) {
            return res.status(404).json({ error: "Trainer not found" });
        }
        res.json(trainerData);
    } catch (error) {
        console.error("Error while fetching trainer data:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Add a new trainer
trainerRouter.post("/add", async (req, res) => {
    const payload = req.body;
    payload.timeslot = [
        { id: 1, startTime: 6, endTime: 8, isBooked: false },
        { id: 2, startTime: 8, endTime: 10, isBooked: false },
        { id: 3, startTime: 16, endTime: 18, isBooked: false },
        { id: 4, startTime: 18, endTime: 20, isBooked: false },
    ];

    try {
        await TrainerModel.create(payload);
        res.status(201).json({ msg: "Trainer added" });
    } catch (error) {
        console.error("Error while adding a trainer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update trainer by ID
trainerRouter.patch("/update/:id", async (req, res) => {
    const id = req.params.id;
    const payload = req.body;

    try {
        const updatedTrainerData = await TrainerModel.findByIdAndUpdate(id, payload, { new: true });
        if (!updatedTrainerData) {
            return res.status(404).json({ error: "Trainer not found" });
        }
        res.json({ msg: "Trainer data updated" });
    } catch (error) {
        console.error("Error while updating trainer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update timeslot for a trainer
trainerRouter.patch("/updateTime/:id/:timeId", async (req, res) => {
    const id = req.params.id;
    const timeID = Number(req.params.timeId); // Ensure timeID is a number

    try {
        const trainer = await TrainerModel.findById(id);
        if (!trainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }

        const updatedTimeslot = trainer.timeslot.map((elem) => {
            if (elem.id === timeID) {
                elem.isBooked = true;
            }
            return elem;
        });

        trainer.timeslot = updatedTimeslot;
        await trainer.save();

        res.json({ msg: "Timeslot updated" });
    } catch (error) {
        console.error("Error while updating timeslot:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete trainer by ID
trainerRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedTrainer = await TrainerModel.findByIdAndDelete(id);
        if (!deletedTrainer) {
            return res.status(404).json({ error: "Trainer not found" });
        }
        res.json({ msg: "Trainer data deleted" });
    } catch (error) {
        console.error("Error while deleting trainer:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = {
    trainerRouter
};
