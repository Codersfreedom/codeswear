import jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken)
      return res.status(401).json({ message: "Unauthorized-no access token" });

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({message:"Internal server error"})
    console.log("Error in protectRoute middleware",error.message)
  }
}
