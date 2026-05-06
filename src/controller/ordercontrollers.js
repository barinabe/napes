import { prisma } from "../config/prisma.js";
import { z } from "zod";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
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

    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({
          success: "failed",
          message: `Product ${item.productId} not found`
        });
      }

      totalPrice += product.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice
      }
    });

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
      message: "Order created",
      order
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: "failed",
      message: "Internal server error"
    });
  }
};


// ✅ CONFIRM DELIVERY
export const confirmOrderDelivered = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({
        success: "failed",
        message: "Order not found"
      });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({
        success: "failed",
        message: "Not your order"
      });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "DELIVERED" }
    });

    return res.status(200).json({
      success: "true",
      message: "Order delivered",
      order: updated
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: "failed",
      message: "Internal server error"
    });
  }
};