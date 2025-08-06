const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
} = require("../controllers/post.controller");
const { postUpload } = require("../middleware/upload");

// ✅ POST /create_post with optional media
router.post("/create_post", auth, postUpload.single("media"), createPost);

// ✅ GET /get_all_posts
router.get("/get_all_posts", getAllPosts);

// ✅ GET /get_post_by
router.get("/get_post_by_id", getPostById);

// ✅ GET /user/:id to get posts by user ID
router.get("/user/:id", getPostsByUserId);

module.exports = router;
