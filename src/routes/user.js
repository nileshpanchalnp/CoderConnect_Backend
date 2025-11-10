import express from "express";
import { signUp, signIn, signOut } from "../controllers/user.js";

const user_router = express.Router();

user_router.post("/signup", signUp);
user_router.post("/signin", signIn);
user_router.post("/signout", signOut);

export default user_router;