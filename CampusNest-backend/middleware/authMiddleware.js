const jwt = require("jsonwebtoken");
const User = require("../models/User");


const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — please login first",
    });
  }

 
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid — please log in again",
    });
  }

  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  next();
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied — only ${roles.join(", ")} can do this`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };


