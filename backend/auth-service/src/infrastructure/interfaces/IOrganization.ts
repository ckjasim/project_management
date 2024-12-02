import { Document } from "mongoose";

export default interface IOrganization extends Document {
    name: string; 
    email: string;
    subscriptionTier?: string; 
    isActive?: boolean;
    billingInfo?: {
      stripeCustomerId?: string;
      currentPlan?: string;
      renewalDate?: Date;
    };
  }