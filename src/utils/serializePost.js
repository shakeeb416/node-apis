const getS3FileUrl = require("./gets3FileUrl");

function serializePost(post) {
  return {
    id: post.id,
    content: post.content,
    media: getS3FileUrl("posts", post.media),
    createdAt: post.createdAt,
    user: post.user
      ? {
          name: post.user.name,
          email: post.user.email,
        }
      : null,
  };
}

module.exports = serializePost;
