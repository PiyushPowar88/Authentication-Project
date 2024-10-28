import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";

// Function to generate token and set it in a cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
};

// Signup controller
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours expiration
    });

    await user.save();
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Email verification controller
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    console.log("Received verification code:", code);
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired verification token");
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error during email verification:", error.message);
    res.status(500).json({ success: false, message: "An error occurred during email verification", error: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Logout controller
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Forgot Password controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "An error occurred during password reset", error: error.message });
  }
};

// Reset Password controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;  // Ensure token is received correctly
    const { password } = req.body;
    
    // Find user by token and check if it hasn't expired
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpiresAt: { $gt: Date.now() }  // Corrected expiration field
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);  // Use bcrypt correctly
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    // Save the updated user and send success email
    await user.save();
    await sendResetSuccessEmail(user.email);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

// Check authentication status controller
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
