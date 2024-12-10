import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import IEmployee from '../../infrastructure/interfaces/IEmployee';

const employeeSchema = new mongoose.Schema<IEmployee>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'organization',
      required: [true, 'organization association is required'],
    },
    mobile: {
      type: Number,
    },
    role: {
      type: String,
      required: true,
    },
    jobRole: {
      type: String,
      required: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const EmployeeModel = mongoose.model('Employee', employeeSchema);
