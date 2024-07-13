import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where:{
        city:query.city || undefined,
        type:query.type || undefined,
        property:query.property || undefined,
        bedroom:parseInt(query.bedroom) || undefined,
        price:{
          gte:parseInt(query.minPrice) || 0,
          lte:parseInt(query.maxPrice) || 100000,
        }
      }
    });

    res.status(201).json({ message: "Success", posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to get posts",
    });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: {id: id},
      include:{
        postDetail:true,
        user:{
            select:{
                username:true,
                avatar:true
            }
        }
      }
    });
    if(!post){
        res.status(203).json({
            message:"No Property Available"
        })
    }

    res.status(201).json({ message: "Success", post: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to get post",
    });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail:{
            create:body.postDetail
        }
      },
    });
    res.status(201).json({ message: "Property Added SuccessFully", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to Add Post",
    });
  }
};

export const updatePost = async (req, res) => {};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (post.userId !== tokenUserId) {
      res.status(403).json({
        message: "Not authorized!",
      });
    }
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: "Post deleted SuccessFullt",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to Delete Post",
    });
  }
};
