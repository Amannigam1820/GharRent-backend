import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  console.log(query);

  let filter = {};

  // Add filters only if they are provided in the query
  if (query.city) filter.city = query.city;
  if (query.type) filter.type = query.type;
  if (query.property) filter.property = query.property;
  if (query.bedroom) filter.bedroom = parseInt(query.bedroom);
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.gte = parseInt(query.minPrice);
    if (query.maxPrice) filter.price.lte = parseInt(query.maxPrice);
  }

  try {
    const posts = await prisma.post.findMany({
      where: 
        filter
        // city: query.city || "",
        // type: query.type || "",
        // property: query.property || "",
        // bedroom: parseInt(query.bedroom) || "",
        // price: {
        //   gte: parseInt(query.minPrice) || 0,
        //   lte: parseInt(query.maxPrice) || 100000,
        // },
      
    });

    res.status(201).json({ message: "Success", posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to get posts",
    });
  }
};

// export const getPost = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const post = await prisma.post.findUnique({
//       where: { id: id },
//       include: {
//         postDetail: true,
//         user: {
//           select: {
//             username: true,
//             avatar: true,
//           },
//         },
//       },
//     });
//     const token = req.cookies?.token;
//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (!err) {
//           const saved = await prisma.savedPost.findUnique({
//             where: {
//               userId_postId: {
//                 postId: id,
//                 userId: payload.id,
//               },
//             },
//           });
//           return res.status(200).json({ ...post, isSaved: saved ? true : false });
//         }
//       });
//     }
//     res.status(200).json({ ...post, isSaved: false });
 

//     res.status(201).json({ message: "Success", post: post });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "failed to get post",
//     });
//   }
// };
export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(200).json({ ...post, isSaved: false });
        }

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        return res.status(200).json({ ...post, isSaved: saved ? true : false });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
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
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res
      .status(201)
      .json({ message: "Property Added SuccessFully", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to Add Post",
    });
  }
};

export const updatePost = async (req, res) => {
  
};

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
