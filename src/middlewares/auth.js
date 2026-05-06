import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: "failed",
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ attach user to request
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({
        success: "failed",
        message: "User not found"
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: "failed",
      message: "Invalid token"
    });
  }
};