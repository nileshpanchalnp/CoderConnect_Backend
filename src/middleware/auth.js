import jwt from "jsonwebtoken";
import {User} from "../models/user.js"

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // token stored in cookie

    if (!token) return res.status(401).json({ message: "Login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user; // store user data in request
    next();

  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
