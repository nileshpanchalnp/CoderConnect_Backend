import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

// STRICT AUTH (Keep this for sensitive actions like Voting)
export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Login required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};

// --- ADD THIS NEW FUNCTION ---
// OPTIONAL AUTH (Use this for Viewing Questions)
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    // 1. If no token, user is a Guest. Do not error, just call next().
    if (!token) {
        return next();
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user
    const user = await User.findById(decoded.id);
    
    // 4. If user exists, attach to req. Only then will buttons turn Green/Red.
    if (user) {
        req.user = user;
    }
    
    // 5. Proceed
    next();

  } catch (error) {
    // If token is expired or invalid, ignore error and proceed as Guest
    console.log("Optional Auth: Token invalid or expired, treating as guest");
    next();
  }
};