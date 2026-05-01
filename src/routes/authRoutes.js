import express from "express";
import { loginUser } from "../controller/authcontrollers.js";

const router = express.Router();

// LOGIN ROUTE
router.post("/login", loginUser);

export default router;