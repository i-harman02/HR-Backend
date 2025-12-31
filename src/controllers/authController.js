import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import pendingUser from "../models/pendingUser.js";

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pendingUseR = await pendingUser.findOne({ email });
    if (pendingUseR) {
      return res.status(400).json({
        message: "Your request is already pending for approval",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "employee") {
      await pendingUser.create({
        name,
        email,
        password: hashedPassword,
        role: "employee",
        status: "pending",
      });

      return res.status(200).json({
        message: "Signup request sent to admin for approval",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
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
    const user = await User.find({}).select("_id name email role");
    return res
      .status(201)
      .json({ message: "User List fetched successfully.", data: user });
  } catch (error) {
    console.error("Error in get user", error.message);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const getpendingUser = async (req, res) => {
  try {
    const data = await pendingUser
      .find({ status: "pending" })
      .select("name email role");
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Don't get pending User" });
  }
};

const approveEmployee = async (req, res) => {
  const { id } = req.params;

  const pendingUser = await pendingUser.findById(id);

  await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password,
    role: "employee",
  });

  pendingUser.status = "approved";
  await pendingUser.save();

  res.json({ message: "Employee Approved" });
};

export {
  register,
  login,
  getUser,
  approveEmployee,
  getpendingUser,
};
