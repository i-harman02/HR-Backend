import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

connectDB();

const PORT = process?.env?.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
  