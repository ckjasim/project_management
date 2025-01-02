import mongoose from "mongoose";
import IOrganization from "../../infrastructure/interfaces/IOrganization";


const organizationSchema = new mongoose.Schema<IOrganization>({
  name: { 
    type: String, 
    required: [true, "Organization name is required"],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Organization email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  subscriptionTier: {
    type: String,
    enum: ['basic', 'premium'],
    default: 'basic'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  billingInfo: { 
    // stripeCustomerId: String,
    // currentPlan: String,
    renewalDate: Date
  }
}, { timestamps: true });

export const OrganizationModel = mongoose.model('Organization', organizationSchema);