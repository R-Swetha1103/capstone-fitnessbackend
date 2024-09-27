const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { trainerRouter } = require("./Routes/trainerRoutes");
const { bookingRoutes } = require("./Routes/bookingRoutes");
const { signupRoute } = require("./Routes/signupRoutes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());

// Routes
app.use("/user", signupRoute);
app.use("/trainer", trainerRouter);
app.use("/booking", bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
const startServer = async () => {
    try {
        await connection; // Ensure DB connection is established
        console.log("Connected to the MongoDB database");

        const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
        app.listen(3001, () => {
            console.log("Server is running on http://localhost:3001");
        });
    } catch (error) {
        console.error("Error connecting to the MongoDB database", error);
    }
};

startServer();
