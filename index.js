import express from "express";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
// Product controllers
import {
    deleteProduct,
    getProduct,
    getProductId,
    saveProduct,
    updateProduct
} from './src/controller/productcontrollers.js';

// User controllers (UPDATED WITH LOGIN)
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  
} from "./src/controller/usercontrollers.js";

// Prisma
import { prisma } from './src/config/prisma.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);

// PRODUCT ROUTES

app.post('/product', saveProduct);
app.get('/products', getProduct);
app.get('/products/:id', getProductId);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);


// USER ROUTES

app.post('/users', createUser);
app.get('/users', getUsers);
app.get('/users/:id', getUserById);
app.put('/users/:id', updateUser);
app.delete('/users/:id', deleteUser);



// SERVER START
app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        console.log("DB connected");
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error("DB connection failed:", error);
        process.exit(1);
    }
});