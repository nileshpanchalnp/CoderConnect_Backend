import { User } from "../models/user.js";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { email, password, username, display_name } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create profile
    await User.create({
      email,
      password,
      username,
      display_name,
      reputation: 0,
    });

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Plain password check (NO BCRYPT)
    if (password !== user.password)
      return res.status(400).json({ message: "Invalid email or password" });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        reputation: user.reputation,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const signOut = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
