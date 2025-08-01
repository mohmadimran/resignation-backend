const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const verifyTokenService = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyTokenService };
