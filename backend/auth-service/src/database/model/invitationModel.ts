import mongoose, { Schema } from "mongoose";
import IInvitation from "../../infrastructure/interfaces/IInvitation";

const invitationSchema = new mongoose.Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'],
      default: 'pending'
    },
    jobRole: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: 'Expiration date must be in the future.'
      }
    }
  },
  { timestamps: true }
);

// Add indexes for performance optimization
invitationSchema.index({ status: 1, expiresAt: 1 });

export const InvitationModel = mongoose.model('Invitation', invitationSchema);
