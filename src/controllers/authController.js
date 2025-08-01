const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../services/tokenService");

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    // Auto-create HR admin user if not present
    if (!user && username === "admin" && password === "admin") {
      user = await User.create({
        username: "admin",
        password: await bcrypt.hash("admin", 10),
        role: "HR",
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  Use generateToken from tokenService
    const token = generateToken({ id: user._id, role: user.role });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
};
