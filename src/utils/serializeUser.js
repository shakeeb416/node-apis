const getS3FileUrl = require("./gets3FileUrl");

const DEFAULT_AVATAR_URL = getS3FileUrl("avatars", "avatar.png");

function serializeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    avatar: user.avatar
      ? getS3FileUrl("avatars", user.avatar)
      : DEFAULT_AVATAR_URL,
    phone: user.phone,
    address: user.address,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

module.exports = serializeUser;
