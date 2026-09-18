/**
 * Turns any thrown error into a JSON response.
 * Controllers can call next(error) and this file handles the rest.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong on the server'
  });
}

module.exports = errorHandler;
