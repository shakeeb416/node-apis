const config = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL || `http://localhost:3000`,
  defaultAvatarPath: process.env.DEFAULT_AVATAR_PATH || "/uploads/avatar.png",
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_PAGE_LIMIT || "10"),

  get defaultAvatarUrl() {
    return this.baseUrl + this.defaultAvatarPath;
  },
};

module.exports = config;
