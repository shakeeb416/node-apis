function successResponse(res, message, data = {}, pagination = null) {
  const response = {
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(200).json(response);
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
