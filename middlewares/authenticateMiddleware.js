const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization;

    try {
        if (!token) {
            return res.status(401).json({ msg: "Please log in again!" });
        }

        if (blacklist.includes(token)) {
            return res.status(401).json({ msg: "Session has expired. Please log in again." });
        }

        jwt.verify(token, process.env.NORMAL_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(401).json({ msg: "Invalid token. Please log in again!" });
            }

            req.body.userId = decoded.userId;
            req.body.userEmail = decoded.email;
            next();
        });
    } catch (error) {
        console.error("Error in authenticate middleware:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    authenticate
};
