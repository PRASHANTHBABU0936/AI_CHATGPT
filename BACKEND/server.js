

import express from "express";
import "dotenv/config";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}
// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
// model: "gpt-4o",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } 
//     catch(err) {
//         console.log(err);
//     }});

app.post("/test", async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{
                role: "user",
                content: req.body.message
            }]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        console.log(data.choices[0].message.content); // reply
        res.send(data.choices[0].message.content);
    } 
    catch(err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

//     catch (err) {
//     console.error(err);
//     res.status(500).send("Something went wrong");
// }
// });
