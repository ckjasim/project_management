import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import IOtp from '../../infrastructure/interfaces/IOtp';

const otpSchema = new mongoose.Schema<IOtp>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiredAt: { 
    type: Date, 
    required: true, 
    default: function () {
      return new Date(Date.now() + 120 * 1000);
    },
  },
});


otpSchema.pre('save', async function (next) {
  if (this.isModified('otp')) {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
  }
  next();
});


otpSchema.methods.compareOtp = async function (enteredOtp: string) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const otpModel = mongoose.model<IOtp>('OTP', otpSchema);
