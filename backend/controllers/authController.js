import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// user registration
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters long",
      });
    }

    // checking if user exists
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      avatar: name.charAt(0).toUpperCase(),
    });

    const token = signToken(user._id);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// for fetching the currently authenticated user
export const me = async (req, res) => {
  res.json({ user: req.user });
};

// update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, morningMotivation } = req.body;

    const user = User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) {
      user.name = name;
      user.avatar = name.charAt(0).toUpperCase();
    }

    if (morningMotivation !== undefined) {
      user.morningMotivation = morningMotivation;
    }

    await user.save();

    res.json({ user });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
