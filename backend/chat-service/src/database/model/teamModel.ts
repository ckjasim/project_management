import mongoose, { Schema, Document, ObjectId } from "mongoose";

import ITeam from "../../infrastructure/interfaces/ITeam";

const teamSchema = new mongoose.Schema<ITeam>({
  teamName: { type: String, required: [true, "Team name is required"] },
  members: { type: [Schema.Types.String], required: true, default: [] },
  eventHistory: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
  organization:{type: String, required: [true, "organization is required"] },
  updatedAt: { type: Date, default: Date.now },
});

teamSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const TeamModel = mongoose.model<ITeam>("Team", teamSchema);
