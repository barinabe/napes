import { prisma } from "../config/prisma.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { z } from "zod";

// LOGIN CONTROLLER
export const loginUser = async (req, res) => {
  try {
    // 1. VALIDATION SCHEMA
    const loginSchema = z.object({
      email: z.string().email("Use valid email format"),
      password: z.string().min(8, "At least 8 characters"),
    });

    // 2. VALIDATE INPUT
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
        errors: result.error.errors,
      });
    }

    // 3. USE VALIDATED DATA
    const { email, password } = result.data;

    // 4. FIND USER
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 5. CHECK PASSWORD
    const isValid = await argon2.verify(user.password, password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 6. GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    // 7. REMOVE PASSWORD
    const { password: _, ...safeUser } = user;

    // 8. RESPONSE
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login error",
    });
  }
};