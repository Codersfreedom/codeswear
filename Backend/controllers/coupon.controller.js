import Coupon from "../models/coupon.model.js";

export async function getCoupon(req, res) {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.status(200).json(coupon || null);
  } catch (error) {
    console.log("Internal server error", error.message);
    res.status(500).json("Internal server error");
  }
}

export async function validateCoupon(req, res) {
  try {
    const { code } = req.body;
    
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) return res.status(404).json({message:"coupon not found!"});

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(403).json({ message: "Coupon is expired" });
    }

    res.status(200).json({
      code: coupon.code,
      expirationDate: coupon.expirationDate,
      discountPercentage:coupon.discountPercentage,
      message: "coupon is valid",
    });
  } catch (error) {
    console.log("Internal server error", error.message);
    res.status(500).json("Internal server error");
  }
}
