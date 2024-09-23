import { stripe } from "../db/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export async function createSession(req, res) {
  try {
    const { products, coupon } = req.body;
    
    if (!Array.isArray(products) || products.length == 0) {
      return res.status(400).json({ message: "No product provided" });
    }
    let totalAmount = 0;
    const items = products.map((product) => {
      const amount = Math.round(product.price * 100);

      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let couponCode = null;

    if (coupon) {
      couponCode = await Coupon.findOne({
        code: coupon,
        userId: req.user._id,
        isActive: true,
      });
     
      if (couponCode) {
        totalAmount -= Math.round(
          (totalAmount * couponCode.discountPercentage) / 100
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase_success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase_cancel`,
      discounts: couponCode
        ? [
            {
              coupon: await createStripeCoupon(couponCode.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: coupon || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 2000) {
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, amount: totalAmount / 100 });
  } catch (error) {
    console.log("Error in createSession payment controller", error.message);
    res.status(500).json("Internal server error");
  }
}

export async function checkoutSuccess(req, res) {
  try {
    const { session_id } = req.body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status == "paid") {
      if (session.metadata.couponCode) {
        // updating the coupon status false in database
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,                               
            userId: req.user._id,
          },
          {
            isActive: false,
          }
        );
      }

      // create a new order in database

      const products = JSON.parse(session.metadata.products);

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((p) => ({
          product: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        totalAmount: session.amount_total,
        stripeSessionId: session_id,
      });

      await newOrder.save();
      res.status(200).json({
        message: "Order placed",
        success: true,
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.log("Error in checkout-success payment controller", error.message);
    res.status(500).json("Internal server error");
  }
}

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    discountPercentage: 10,
    userId: userId,
  });

  await newCoupon.save();
  return newCoupon;
}
