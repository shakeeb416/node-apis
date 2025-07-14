function serializePost(post) {
    return {
      id: post.id,
      content: post.content,
      mediaUrl: post.mediaUrl,
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
  