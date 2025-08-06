const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { successResponse, errorResponse } = require("../utils/response");
const serializePost = require("../utils/serializePost");
const serializePagination = require("../utils/serializePagination");
const { DEFAULT_LIMIT } = require("../config");

const prisma = new PrismaClient();

// ✅ Create a new post
const createPost = async (req, res) => {
  const { content } = req.body;
  const file = req.file;

  if (!content) {
    return errorResponse(res, "Content is required", 400);
  }
  let media = null;
  if (file) {
    media = `${file.filename}`;
  }

  try {
    const post = await prisma.post.create({
      data: {
        content,
        media,
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
  const { search, page = 1, limit } = req.query;

  const trimmedSearch = search?.trim();

  let per_page = (!isNaN(limit) && Number(limit)) || DEFAULT_LIMIT;
  const pageNumber = parseInt(page);
  const skip = (pageNumber - 1) * per_page;

  try {
    const where = trimmedSearch
      ? {
          content: {
            contains: trimmedSearch,
            mode: "insensitive",
          },
        }
      : undefined;

    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    if (posts.length === 0) {
      return errorResponse(res, "No posts found", 404);
    }

    const serializedPosts = posts.map(serializePost);
    const pagination = serializePagination({
      total: totalCount,
      page: pageNumber,
      limit: per_page,
    });

    return successResponse(
      res,
      "Posts fetched successfully",
      serializedPosts,
      pagination
    );
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
  const { page = 1, search = "", limit } = req.query;

  // ✅ Validate userId
  if (isNaN(userId)) return errorResponse(res, "Invalid user ID", 400);

  let per_page = (!isNaN(limit) && Number(limit)) || DEFAULT_LIMIT;

  // ✅ Validate and sanitize page
  const pageNumber = Math.max(1, parseInt(page) || 1);
  const skip = (pageNumber - 1) * per_page;

  // ✅ Trim and check search input
  const trimmedSearch = search.trim();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // ✅ Prepare dynamic where condition
    const postWhere = {
      userId,
      ...(trimmedSearch.length > 1 && {
        content: {
          contains: trimmedSearch,
          mode: "insensitive",
        },
      }),
    };

    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where: postWhere }),
      prisma.post.findMany({
        where: postWhere,
        skip,
        take: per_page,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    if (posts.length === 0) {
      return errorResponse(res, "No posts found", 404);
    }

    const serializedPosts = posts.map(serializePost);
    const pagination = serializePagination({
      total: totalCount,
      page: pageNumber,
      limit: per_page,
    });

    // ✅ Return 200 with empty array (not 404)
    return successResponse(
      res,
      "Posts fetched successfully",
      serializedPosts,
      pagination
    );
  } catch (err) {
    // ✅ Add context to error log
    console.error("Error fetching posts by user", {
      userId,
      search: trimmedSearch,
      page: pageNumber,
      error: err.message,
    });

    return errorResponse(res, "Failed to fetch posts");
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
};
