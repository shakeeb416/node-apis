function serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      contactNo: user.contactNo,
      address: user.address,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
  
  module.exports = serializeUser;
  