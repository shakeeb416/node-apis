const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const serializeUser = require("../utils/serializeUser");
const { successResponse, errorResponse } = require("../utils/response");
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

const generateUsername = async (name) => {
  const base = name.toLowerCase().replace(/\s+/g, "");
  let username = base;
  let counter = 1;

  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${base}${counter++}`;
  }

  return username;
};

const register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const username = await generateUsername(name);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        address,
        username,
        status: "active",
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return errorResponse(res, "Invalid credentials", 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return errorResponse(res, "Invalid credentials", 401);

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return successResponse(res, "Login successful", {
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Login failed");
  }
};

module.exports = { register, login };
