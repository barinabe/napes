import { prisma } from "../config/prisma.js";
import { z } from "zod";

export const createOrder = async (req, res) => {
  try {
    // ✅ Validation schema
    const schema = z.object({
      userId: z.number(),
      products: z.array(
        z.object({
          productId: z.number(),
          quantity: z.number().min(1)
        })
      )
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: "failed",
        message: result.error.errors
      });
    }

    const { userId, products } = result.data;

    // ✅ Check user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: "failed",
        message: "User not found"
      });
    }

    let totalPrice = 0;

    // ✅ Loop properly
    for (const item of products) {
      const productFromDb = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!productFromDb) {
        return res.status(404).json({
          success: "failed",
          message: `Product with id ${item.productId} not found`
        });
      }

      totalPrice += productFromDb.price * item.quantity;
    }

    // ✅ Create order
    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice
      }
    });

    // ✅ Create ordered products
    for (const item of products) {
      await prisma.orderedProduct.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity
        }
      });
    }

    return res.status(201).json({
      success: "true",
      message: "Order created successfully",
      order
    });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: "failed",
      message: "Internal server error"
    });
  }
};