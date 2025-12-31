import express from "express";
import { register,login, getUser, getpendingUser, approveEmployee } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getUser);
router.get("/pending-employees", getpendingUser);
router.post("/approve", approveEmployee);


export default router;
