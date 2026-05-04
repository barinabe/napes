//import prisma
import { success } from 'zod';
import { prisma } from '../config/prisma.js';
import jwt from "jsonwebtoken";

//add product
export const saveProduct = async (req, res) => {
 try{


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

//get product by all
export const getProduct = async (req, res) => {
    try {
        const product = await prisma.product.findMany();
        res.status(200).json({
            status: "data fecthed",
            data: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "failed"
        });
    }
};


//get product by id
export const getProductId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma.product.findUnique({
            where: {id}
        });
        res.status(200).json({
            status: "fetched",
            data: product
        });
    } catch (error) {
        console.error(error);
            res.status(500).json({
                status: "failed"
            });
        }
    }


    //updae product
    export const updateProduct = async (req, res) => {
        try {
        const id = Number(req.params.id);
    const updated = await prisma.product.update({
        where: {id},
        data: req.body
    });
    res.status(200).json({
        status: "updated",
        data: updated
    })
        } catch (error) {
           console.error(error);
           res.status(500).json({
status: "failed"
           });
        }
    };

    //delete product
    export const deleteProduct = async (req, res) => {
        try {
        const id = Number(req.params.id);
        await prisma.product.delete({
            where: {id}
           });
           res.status(200).json({
            status: "deleted"
           });
        
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed"
            });
        }
    }