import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);


// Test route for OpenAI
app.post("/test", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: req.body.message }]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        console.log(data.choices[0].message.content);
        res.send(data.choices[0].message.content);
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

// Connect to MongoDB and start server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected with Database!");

        // Start server after DB connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect with Db", err);
        process.exit(1);
    }
};

connectDB();
