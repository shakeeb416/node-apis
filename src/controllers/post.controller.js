const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { successResponse, errorResponse } = require("../utils/response");
const serializePost = require("../utils/serializePost");

const prisma = new PrismaClient();

// ✅ Create a new post
const createPost = async (req, res) => {
  const { content } = req.body;
  const file = req.file;

  if (!content) {
    return errorResponse(res, "Content is required", 400);
  }

  let mediaUrl = null;
  if (file) {
    mediaUrl = `/uploads/${file.filename}`;
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        mediaUrl,
        userId: req.user.userId, // 👈 from decoded JWT
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(
      res,
      "Post created successfully",
      serializePost(post)
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to create post");
  }
};

// ✅ Get all posts (with optional search)
const getAllPosts = async (req, res) => {
  const { search } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: search
        ? {
            content: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const serializedPosts = posts.map(serializePost);
    return successResponse(res, "Posts fetched successfully", serializedPosts);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch posts");
  }
};

// ✅ Get a single post by ID
const getPostById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return errorResponse(res, "Post ID is required", 400);
  }

  if (isNaN(id)) {
    return errorResponse(res, "Invalid post ID", 400);
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!post) {
      return errorResponse(res, "Post not found", 404); // ✅ Return 404
    }

    return successResponse(
      res,
      "Post fetched successfully",
      serializePost(post)
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch post");
  }
};

// ✅ Get all posts by USER_ID
const getPostsByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);

  if (isNaN(userId)) return errorResponse(res, "Invalid user ID", 400);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404); // ✅ Return 404
    }

    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return successResponse(
      res,
      "Posts fetched successfully",
      posts.map(serializePost)
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch posts");
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
};
