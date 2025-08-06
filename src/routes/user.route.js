const express = require("express");
const router = express.Router();
const { getAllUsers, editProfile } = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const { avatarUpload } = require("../middleware/upload");

router.get("/get_all_users", getAllUsers); // Added auth middleware
router.patch("/edit_profile", auth, avatarUpload.single("avatar"), editProfile); // Fixed upload middleware usage

module.exports = router;
