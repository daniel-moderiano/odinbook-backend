// Replace the inbuilt express error handler by defining a middleware func that accepts the err object in addition to the usual middleware params
const errorHandler = (err, req, res, next) => {
  // Check if a status code was manually set already during the req/res cycle, otherwise use default 500 internal server error
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  // Return JSON instead of the default HTML error template by Express
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack // Do not add stack for production apps
  });
};

module.exports = {
  errorHandler,
}