import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRoutes from "./src/routes/authRoutes.js";

// Controllers
import { createOrder } from "./src/controller/ordercontrollers.js";

// Product controllers
import {
  deleteProduct,
  getProduct,
  getProductId,
  saveProduct,
  updateProduct
} from "./src/controller/productcontrollers.js";

// User controllers
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "./src/controller/usercontrollers.js";

// Prisma
import { prisma } from "./src/config/prisma.js";

// Middleware
import { protect } from "./src/middlewares/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// ✅ Auth Routes
app.use("/auth", authRoutes);

// =====================
// PRODUCT ROUTES
// =====================
app.post("/product", protect, saveProduct);
app.get("/products", getProduct);
app.get("/products/:id", getProductId);
app.put("/products/:id", protect, updateProduct);
app.delete("/products/:id", protect, deleteProduct);

// =====================
// ORDER ROUTES
// =====================
app.post("/orders", protect, createOrder);

// =====================
// USER ROUTES
// =====================
app.post("/users", createUser);
app.get("/users", getUsers);
app.get("/users/:id", getUserById);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// =====================
// SERVER START
// =====================
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ DB connected");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  }
});