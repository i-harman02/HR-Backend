import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password ) {
    return res.status(400).json({ message: "All Fields are required." });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  res
    .status(201)
    .json({ message: "User registered successfully.", data: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
    
  );


  res.json({ message: "User login successfully.", token, user });
};

const getUser = async (req, res) => {
  try {
    const user = await User.find({})
      .select("_id name email role");
    return res
      .status(201)
      .json({ message: "User List fetched successfully.", data: user });
  } catch (error) {
    console.error("Error in get user", error.message);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export { register, login, getUser };
