import { prisma } from '../config/prisma.js';

// CREATE
export const saveProduct = async (req, res) => {
    try {
        const product = await prisma.product.create({
            data: req.body
        });

        res.status(201).json({
            status: "success",
            data: product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "failed" });
    }
};

// GET ALL
export const getProduct = async (req, res) => {
    try {
        const products = await prisma.product.findMany();

        res.json({
            status: "success",
            data: products
        });
    } catch (error) {
        res.status(500).json({ status: "failed" });
    }
};

// GET ONE
export const getProductId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ status: "not found" });
        }

        res.json({ status: "success", data: product });
    } catch (error) {
        res.status(500).json({ status: "failed" });
    }
};

// UPDATE
export const updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const updated = await prisma.product.update({
            where: { id },
            data: req.body
        });

        res.json({
            status: "updated",
            data: updated
        });
    } catch (error) {
        res.status(500).json({ status: "failed" });
    }
};

// DELETE
export const deleteProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.product.delete({
            where: { id }
        });

        res.json({ status: "deleted" });
    } catch (error) {
        res.status(500).json({ status: "failed" });
    }
};