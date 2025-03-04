import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in Protect Route middleware:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
