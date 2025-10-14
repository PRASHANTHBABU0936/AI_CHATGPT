import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// ------------------ TEST ROUTE ------------------
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            userId: "testUserId", // For testing only
            title: "Testing New Thread2",
            messages: []
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to save in DB" });
    }
});

// ------------------ GET ALL THREADS ------------------
router.get("/thread", authenticateToken, async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// ------------------ GET SINGLE THREAD MESSAGES ------------------
router.get("/thread/:threadId", authenticateToken, async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({ threadId, userId: req.user.id });
        if (!thread) return res.status(404).json({ error: "Thread not found" });
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch chat" });
    }
});

// ------------------ DELETE THREAD ------------------
router.delete("/thread/:threadId", authenticateToken, async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id });
        if (!deletedThread) return res.status(404).json({ error: "Thread not found" });
        return res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to delete thread" });
    }
});

// ------------------ POST NEW CHAT ------------------
router.post("/chat", authenticateToken, async (req, res) => {
    const { threadId, message } = req.body;
    if (!threadId || !message) return res.status(400).json({ error: "Missing required fields" });

    try {
        // Find or create thread
        let thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            thread = new Thread({
                threadId,
                userId: req.user.id,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Get assistant reply from OpenAI
        const assistantReply = await getOpenAIAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

export default router;
