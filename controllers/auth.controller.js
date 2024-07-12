import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, contact, password } = req.body;

  //console.log(username,email,contact,password);

  // HASH THE PASSWORD FIRST

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        contact,
        password: hashedPassword,
      },
    });


    const user = await prisma.user.findUnique({
      where: { username },
    });



    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin :false
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: age,
    })
    .status(200)
    .json({ message: "Register SuccessFully", newUser});

   
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin :false
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
      })
      .status(200)
      .json({ message: "Login SuccessFully", userInfo:userInfo });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout SuccessFully" });
};



export const getMyProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
  });
  res.status(200).json({
    success: true,
    user,
  })
}
