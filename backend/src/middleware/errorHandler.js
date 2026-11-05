function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    // Avoid leaking stack traces or internal details to API consumers.
    console.error(err);
  }
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "An unexpected server error occurred." : err.message,
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === "development" && statusCode >= 500 ? { stack: err.stack } : {})
  });
}
module.exports = errorHandler;
