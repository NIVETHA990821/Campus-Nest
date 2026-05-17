const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, universityId } = req.body;

    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created via public registration",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
      return res.status(400).json({
      success: false,
      message: "Password must include at least one number and one symbol (e.g. MyPass@123)",
     });
    }

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

    if (universityId && /[\/\.\-\s]/.test(universityId)) {
      return res.status(400).json({
      success: false,
      message: "University ID cannot contain / . - or spaces. Example: 2022ICT001",
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const seedAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;

    if (!process.env.ADMIN_SEED_KEY) {
      return res.status(500).json({
        success: false,
        message: "Admin seeding is not configured on this server",
      });
    }

    if (secretKey !== process.env.ADMIN_SEED_KEY) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin seed key",
      });
    }

   
    let admin = await User.findOne({ role: "admin" });

    if (admin) {
      admin.name = name || admin.name;
      admin.email = email || admin.email;
      admin.password = password; 
      await admin.save();

      return res.status(200).json({
        success: true,
        message: "Admin account updated successfully",
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    admin = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  seedAdmin,
};

