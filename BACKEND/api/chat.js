import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
import { authenticateToken } from "../middleware/auth.js";

export default async function handler(req, res) {
  try {
    const { method } = req;
    const url = req.url;

    // ================== TEST ==================
    if (method === "POST" && url.endsWith("/test")) {
      const thread = new Thread({
        threadId: "abc",
        title: "Testing New Thread2"
      });

      const response = await thread.save();
      return res.status(200).json(response);
    }

    // ================== GET ALL THREADS ==================
    if (method === "GET" && url.endsWith("/thread")) {
      await authenticateToken(req, res);
      const threads = await Thread.find({ userId: req.user.id }).sort({ updatedAt: -1 });
      return res.status(200).json(threads);
    }

    // ================== GET THREAD BY ID ==================
    if (method === "GET" && url.match(/\/thread\/[^/]+$/)) {
      await authenticateToken(req, res);
      const threadId = url.split("/").pop();
      const thread = await Thread.findOne({ threadId, userId: req.user.id });
      if (!thread) return res.status(404).json({ error: "Thread not found" });
      return res.status(200).json(thread.messages);
    }

    // ================== DELETE THREAD ==================
    if (method === "DELETE" && url.match(/\/thread\/[^/]+$/)) {
      await authenticateToken(req, res);
      const threadId = url.split("/").pop();
      const deletedThread = await Thread.findOneAndDelete({ threadId, userId: req.user.id });
      if (!deletedThread) return res.status(404).json({ error: "Thread not found" });
      return res.status(200).json({ success: "Thread deleted successfully" });
    }

    // ================== CHAT ==================
    if (method === "POST" && url.endsWith("/chat")) {
      await authenticateToken(req, res);
      const { threadId, message } = req.body;

      if (!threadId || !message) return res.status(400).json({ error: "Missing required fields" });

      let thread = await Thread.findOne({ threadId, userId: req.user.id });

      if (!thread) {
        // create new thread
        thread = new Thread({
          threadId,
          userId: req.user.id,
          title: message,
          messages: [{ role: "user", content: message }]
        });
      } else {
        thread.messages.push({ role: "user", content: message });
      }

      const assistantReply = await getOpenAIAPIResponse(message);

      thread.messages.push({ role: "assistant", content: assistantReply });
      thread.updatedAt = new Date();

      await thread.save();
      return res.status(200).json({ reply: assistantReply });
    }

    // Method not allowed
    return res.status(405).json({ error: "Method Not Allowed" });

  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
