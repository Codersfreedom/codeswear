export async function adminRoute(req, res, next) {
  try {
    const user = req.user;
    if (user && user.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Not authorized to access this route" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("Error in adminRoute middlewear", error.message);
  }
}
