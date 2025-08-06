const serializeUser = require("../utils/serializeUser");
const { successResponse, errorResponse } = require("../utils/response");
const serializePagination = require("../utils/serializePagination");
const { PrismaClient } = require("@prisma/client");
const { DEFAULT_LIMIT } = require("../config");
const upload = require("../middleware/upload");
const { deleteFile } = require("../utils/fileHelper");

const prisma = new PrismaClient();

// getAllUsers remains exactly the same
const getAllUsers = async (req, res) => {
  const { search = "", page = 1, limit } = req.query;

  let per_page = (!isNaN(limit) && Number(limit)) || DEFAULT_LIMIT;

  const trimmedSearch = search.trim();
  const pageNumber = parseInt(page);
  const skip = (pageNumber - 1) * per_page;

  try {
    const where = trimmedSearch
      ? {
          OR: [
            { name: { contains: trimmedSearch, mode: "insensitive" } },
            { email: { contains: trimmedSearch, mode: "insensitive" } },
            { username: { contains: trimmedSearch, mode: "insensitive" } },
          ],
        }
      : undefined;

    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: per_page,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    if (users.length === 0) {
      return errorResponse(res, "No users found", 404);
    }

    const serializedUsers = users.map(serializeUser);

    const pagination = serializePagination({
      total: totalCount,
      page: pageNumber,
      limit: per_page,
    });

    return successResponse(
      res,
      "Users fetched successfully",
      serializedUsers,
      pagination
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch users");
  }
};

// Updated editProfile with S3 implementation
const editProfile = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return errorResponse(res, "Unauthorized: user ID not found", 401);
  }

  const { name, address, phone } = req.body;
  const file = req.file;

  let avatar = null;
  if (file) {
    // With S3, the file location is already in file.location
    avatar = file.filename; // This is provided by multer-s3
  }

  if (!name || name.trim() === "") {
    return errorResponse(res, "Name is required", 400);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== "active") {
      return errorResponse(res, "User not found or inactive", 404);
    }

    // Delete old avatar if new one is being uploaded
    if (req.file && user.avatar) {
      await deleteFile(user.avatar, "avatars"); // Delete using just the filename
    }

    const data = {
      name: name.trim(),
      ...(address !== undefined && { address: address || null }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(req.file && { avatar: avatar }), // Store only filename
    };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return successResponse(
      res,
      "Profile updated successfully",
      serializeUser(updatedUser) // Serializer will add full URL
    );
  } catch (err) {
    console.error("Error updating user profile", {
      userId,
      error: err.message,
      stack: err.stack,
    });
    return errorResponse(res, "Failed to update profile");
  }
};

module.exports = {
  getAllUsers,
  editProfile, // Add the upload middleware
};
