import { prisma } from "../config/prisma.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists)
      return res.status(409).json({ success: false, message: "Email already exists" });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await argon2.hash(password),
      },
    });

    const { password: _, ...safeUser } = user;

    res.status(201).json({ success: true, data: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    const safeUsers = users.map(({ password, ...u }) => u);

    res.status(200).json({ success: true, data: safeUsers });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const { password, ...safeUser } = user;

    res.status(200).json({ success: true, data: safeUser });
  } catch {
    res.status(500).json({ success: false, message: "Error fetching user" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    if (data.password) data.password = await argon2.hash(data.password);

    const user = await prisma.user.update({ where: { id }, data });

    const { password, ...safeUser } = user;

    res.status(200).json({ success: true, data: safeUser });
  } catch {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(200).json({ success: true, message: "User deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};




