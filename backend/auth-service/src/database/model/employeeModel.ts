import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import IEmployee from "../../infrastructure/interfaces/IEmployee";

const employeeSchema = new mongoose.Schema<IEmployee>(
  {
    name: { type: String, required: [true, "name is required"] },
    email: { type: String, required: [true, "email is required"], unique: true },
    password: { type: String, required: [true, "password is required"] },
    mobile: { type: Number },
    role: { type: String, required: true },
    organization: { type: String, required: true },
    isBlock: { type: Boolean, default: false, required: true },
    jobRole: { type: String, required: true },
    projectCode: { type: String, required: [true, "projectCode is required"] },
    img: { type: String },
  },
  {
    timestamps: true,
  }
);

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const employeeModel = mongoose.model<IEmployee>("EMPLOYEE", employeeSchema);
