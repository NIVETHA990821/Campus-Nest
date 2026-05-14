const errorHandler = (err, req, res, next) => {
 
  console.error(`Error: ${err.message}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";


  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found — Invalid ID format";
  }


  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate value entered for: ${Object.keys(
      err.keyValue
    ).join(", ")}`;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;

