import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
} from "../config/env.js";

import User from "../models/user.model.js";

const generateAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRY,
    }
  );
  return accessToken;
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRY,
    }
  );
  return refreshToken;
};

const getRefreshTokenExpiry = () => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV=== 'development'?"strict":'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    path: "/",
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV=== 'development'?"strict":'none',
  });
};

const signup = async (req, res, next) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "missing required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role ? role : "user",
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          userID: user._id,
          username: user.username,
          password: "encrypted",
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      messsage: "Error creating user",
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip
    });

    if (user.refreshTokens.length > user.maxSessions) {
      user.refreshTokens.shift();
    }

    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          userId: user._id,
          username: user.username,
          email: user.email,
          password: "encrypted",
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.refreshToken;
    const userId = req.user && req.user.userId;

    if (token && userId) {
      User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: { token: refreshToken } },
      });
    }

    clearRefreshTokenCookie(res);

    return res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if(req.user) {
      return res.status(200).json({
        message: 'User retrieved successfully',
        data: {
          ...req.user
        }
      })
    }
  } catch (error) {
    throw error;
  }
}

export { signup, login, logout, getCurrentUser };