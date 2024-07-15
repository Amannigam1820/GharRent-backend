import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUsers = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId

  
  
  const { password, avatar, ...inputs } = req.body;
  let updatedPassword = null;

 


  if (id !== tokenUserId) {
    return res
      .status(500)
      .json({ message: "You are not Authorized for this operation" });
  }

  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });
    res.status(200).json({message:"User Updated SuccessFully", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUsers = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res
      .status(500)
      .json({ message: "You are not Authorized for this operation" });
  }
  try {
    await prisma.user.delete({
        where:{id}
    })
    res.status(200).json({message:"User Deleted Successfuly"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const savePost = async(req,res)=>{
  const {postId} = req.body;
  console.log(postId);
  const tokenUserId = req.userId;
  console.log(tokenUserId);

  try {
    const savePost  = await prisma.savedPost.findUnique({
      where:{
        userId_postId:{
          userId:tokenUserId,
          postId:postId
        }
      }
    })
    if(savePost){
      await prisma.savedPost.delete({
        where:{
          id:savePost.id
        }
      })
      res.status(200).json({message:"Post removed from saved list"})
    }else{
      await prisma.savedPost.create({
        data:{
          userId:tokenUserId,
          postId:postId
        }
      })
      res.status(201).json({message:"Post saved"})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}