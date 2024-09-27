const mongoose = require("mongoose");

const trainerSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0 }, // Ensure age is non-negative
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] }, // Limit options for gender
    image: { type: String, required: true }, // Assuming image is a URL or path
    price: { type: Number, required: true, min: 0 }, // Ensure price is non-negative
    specialization: { type: [String], required: true }, // Use an array of strings for specializations
    timeslot: { type: [Object], required: true } // Array of objects for timeslots
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const TrainerModel = mongoose.model("Trainer", trainerSchema);

module.exports = {
    TrainerModel
};
