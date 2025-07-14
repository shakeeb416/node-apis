function successResponse(res, message, data = {}) {
    return res.status(200).json({
      message,
      data,
    });
  }
  
  function errorResponse(res, message, statusCode = 500) {
    return res.status(statusCode).json({
      message,
     
    });
  }
  
  module.exports = {
    successResponse,
    errorResponse,
  };
  