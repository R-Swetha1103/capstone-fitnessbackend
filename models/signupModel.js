const mongoose = require("mongoose");

const signupSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, // Ensure email is unique
        validate: {
            validator: function(v) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    mobileNo: { 
        type: String, 
        required: false, // Change to true if you want it mandatory
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Simple validation for 10-digit mobile number
            },
            message: props => `${props.value} is not a valid mobile number!`
        }
    },
    password: { type: String, required: true }
}, { timestamps: true }); // Added timestamps for createdAt and updatedAt fields

const Signupmodel = mongoose.model("User", signupSchema);

module.exports = {
    Signupmodel
};

