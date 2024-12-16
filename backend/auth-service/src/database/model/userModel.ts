import mongoose, { Schema } from "mongoose";
import IUser from "../../infrastructure/interfaces/IUser";
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema<IUser>({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
  role: { 
    type: String, 
    enum: ['admin', 'project manager', 'employee'],
    required: true 
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, "Tenant association is required"]
  },
  isBlock: { 
    type: Boolean, 
    default: false 
  },
  lastLogin: { 
    type: Date 
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const UserModel = mongoose.model('User', userSchema);
