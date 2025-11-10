import express from "express";
import {auth} from "../middleware/auth.js";
import { getUserProfileData } from "../controllers/profile.js";

const profile_router = express.Router();

profile_router.get("/me", auth, getUserProfileData);

export default profile_router;