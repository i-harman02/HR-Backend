import mongoose from "mongoose";

const pendingSchema = new mongoose.Schema(
  {
    name:{ type:String },
    email:{ type:String },
    password: { type:String },
    role : {  type: String, default: "employee" },
    status : { type: String, default: "pending" },
   }
);

export default mongoose.model("PendingUser" , pendingSchema);