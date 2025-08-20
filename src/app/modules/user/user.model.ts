import { model, Schema } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: Object.values(Role), default: Role.SENDER },
    picture: { type: String, required: false },
    address: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: "ACTIVE",
    },
    isVerified: { type: Boolean, default: false },
    // parcels: { type: Schema.Types.ObjectId, ref: "Parcel", required: false },
    auth: [authProviderSchema],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const User = model<IUser>("User", userSchema);