// Replace the inbuilt express error handler by defining a middleware func that accepts the err object in addition to the usual middleware params
const errorHandler = (err, req, res, next) => {
  // Check for existing error status codes. If none exist, set to 500. 
  // For some reason certain mongo errors reach this point but with a 200 status OK response? If the error handler is being called the status code should be an error code no matter what
  let statusCode;
  if (!res.statusCode || res.statusCode === 200) {
    statusCode = 500;
  } else {
    statusCode = res.statusCode;
  }
  res.status(statusCode);
  // Return JSON instead of the default HTML error template by Express
  res.json({
    errorMsg: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack // Do not add stack for production apps
  });
};

module.exports = {
  errorHandler,
}