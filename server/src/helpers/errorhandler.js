const errorHandler = (err, req, res, next) => {
  // Check if response headers have already been sent to the client
  if (res.headersSent) {
    return next(err);
  }

  // Set the status code of the response
  const statusCode =
    res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode); // Set the status code for the response

  // Log the error stack trace to the console if not in production -> for debugging
  if (process.env.NODE_ENV !== "production") {
    console.log(err);
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
