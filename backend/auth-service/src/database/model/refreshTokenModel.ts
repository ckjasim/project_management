import mongoose, { Schema, Document } from 'mongoose';
import IRefreshToken from '../../infrastructure/interfaces/IRefreshToken';


const RefreshTokenSchema: Schema = new Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

// Optionally add an index to make queries faster
RefreshTokenSchema.index({ token: 1 });

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
