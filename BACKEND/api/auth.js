import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken, authRateLimit } from "../middleware/auth.js";

// Vercel serverless handler
export default async function handler(req, res) {
  try {
    const { method } = req;

    // ================== REGISTER ==================
    if (method === "POST" && req.url.endsWith("/register")) {
      await authRateLimit(req, res); // rate limiting

      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required", code: "MISSING_FIELDS" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match", code: "PASSWORD_MISMATCH" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long", code: "PASSWORD_TOO_SHORT" });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) return res.status(400).json({ error: "Email already registered", code: "EMAIL_EXISTS" });

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({ name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
      user.lastLogin = new Date();
      await user.save();

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      });
    }

    // ================== LOGIN ==================
    if (method === "POST" && req.url.endsWith("/login")) {
      await authRateLimit(req, res);

      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Email and password required", code: "MISSING_FIELDS" });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });

      const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
      user.lastLogin = new Date();
      await user.save();

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin,
        },
      });
    }

    // ================== PROFILE ==================
    if (method === "GET" && req.url.endsWith("/profile")) {
      await authenticateToken(req, res);
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });
      return res.status(200).json({ user });
    }

    // ================== UPDATE PROFILE ==================
    if (method === "PUT" && req.url.endsWith("/profile")) {
      await authenticateToken(req, res);

      const { name, avatar } = req.body;
      const updates = {};
      if (name) updates.name = name.trim();
      if (avatar) updates.avatar = avatar;

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select("-password");
      if (!user) return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });

      return res.status(200).json({ message: "Profile updated successfully", user });
    }

    // ================== CHANGE PASSWORD ==================
    if (method === "PUT" && req.url.endsWith("/change-password")) {
      await authenticateToken(req, res);

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) return res.status(400).json({ error: "Current and new password required", code: "MISSING_FIELDS" });
      if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters", code: "PASSWORD_TOO_SHORT" });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found", code: "USER_NOT_FOUND" });

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) return res.status(401).json({ error: "Current password incorrect", code: "INVALID_CURRENT_PASSWORD" });

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();

      return res.status(200).json({ message: "Password changed successfully" });
    }

    // ================== LOGOUT ==================
    if (method === "POST" && req.url.endsWith("/logout")) {
      await authenticateToken(req, res);
      return res.status(200).json({ message: "Logged out successfully" });
    }

    // ================== VERIFY TOKEN ==================
    if (method === "GET" && req.url.endsWith("/verify")) {
      await authenticateToken(req, res);
      return res.status(200).json({ valid: true, user: req.user });
    }

    // Method not allowed
    res.status(405).json({ error: "Method Not Allowed" });

  } catch (error) {
    console.error("Auth API error:", error);
    res.status(500).json({ error: "Internal server error", code: "INTERNAL_ERROR" });
  }
}
