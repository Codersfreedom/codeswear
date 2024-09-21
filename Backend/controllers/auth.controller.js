import { redis } from "../db/redis.js";
import User from "../models/user.model.js";
import { generateTokens } from "../utils/generateTokens.js";
import { setCookie } from "../utils/setCookie.js";
import { setTokenToRedis } from "../utils/setTokenToRedis.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this email address is already exists" });
    }

    const response = await User.create({
      name,
      email,
      password,
    });

    // generate tokens
    const { accessToken, refreshToken } = generateTokens(response._id);

    await setTokenToRedis(response._id, refreshToken); // store the refresh token into redis
    setCookie(res, refreshToken, accessToken); // store the tokens in cookie

    res.status(201).json({
      user: {
        id: response._id,
        name: response.name,
        email: response.email,
      },
      message: "User created succesfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
    console.log("Internal server error", error.message);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exists!" });
    }

    if (await user.comparePassword(password)) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await setTokenToRedis(user._id, refreshToken);
      setCookie(res, accessToken, refreshToken);

      res.json({
        user: {
          name: user.name,
          email: user.email,
        },
        message: "Login successful",
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in auth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh-token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logout success" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedRefreshToken = await redis.get(
      `refresh-token:${decoded.userId}`
    );

    if (refreshToken !== storedRefreshToken) {
      return res.status(401).json({ message: "invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "Production",
      sameSite: "strict",
      httpOnly: true,
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (error) {
    console.log("Error in RefreshToken auth controller", error.message);
    res.status(500).json("Internal server error");
  }
}

export async function getProfile(req, res) {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error in getProfile controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
