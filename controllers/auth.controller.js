import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, contact, password } = req.body;

  // HASH THE PASSWORD FIRST

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        contact,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User Created SuccessFully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

export const login = (req, res) => {};

export const logout = (req, res) => {};
