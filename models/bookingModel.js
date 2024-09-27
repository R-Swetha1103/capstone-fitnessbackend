const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true }, // Reference to Trainer model
    userEmail: { type: String, required: true, validate: {
        validator: function(v) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
    }},
    bookingDate: { type: Date, required: true }, // Use Date type for better handling
    bookingSlot: { type: String, required: true }
}, { timestamps: true });

const Bookingmodel = mongoose.model("Booking", bookingSchema);

module.exports = { Bookingmodel };

// Example usage of Date
const x = new Date();
console.log(x);
console.log(x.toISOString()); // Outputs date in ISO format
console.log(x.toLocaleDateString()); // Outputs date in local format
