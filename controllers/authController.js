const User = require("../models/User");
const jwt = require("jsonwebtoken");


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res) => {
  const { name, email, password, role, universityId } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }

 
  if (role === "student" && !universityId) {
    return res.status(400).json({
      success: false,
      message: "University ID is required for students",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    universityId: role === "student" ? universityId : undefined,
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

 
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    },
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
    },
  });
};

module.exports = {
  register,
  login,
  getProfile,
};


