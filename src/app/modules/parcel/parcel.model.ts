import { model, Schema } from "mongoose";
import { IParcel, TParcelStatus, TParcelType } from "./parcel.interface";
import { getNextSequence } from "../../utils/counters.model";

const statusLogSchema = new Schema(
  {
    status: {
      type: String,
      enum: Object.values(TParcelStatus),
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    location: { type: String, required: false },
    updatedBy: { type: String, required: false },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingId : { type: String, unique: true },
    type: { type: String, enum: Object.values(TParcelType), required: true },
    weight: { type: Number, required: true },
    fee: { type: Number, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderAddress: { type: String, required: true },
    receiverAddress: { type: String, required: true },
    deliveryDate: { type: Date, required: false },
    status: {
      type: String,
      enum: Object.values(TParcelStatus),
      default: TParcelStatus.REQUESTED,
    },
    statusLog: [statusLogSchema],
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


parcelSchema.pre("save",async function (next) {
  if (!this.trackingId) {
const date = new Date();
const yyyymmdd=date.toISOString().slice(0,10).replace(/-/g,"");
const  seq= await getNextSequence("parcelId");
this.trackingId= `${yyyymmdd}-${seq.toString().padStart(6,"0")}`;
  }
  next();
});

export const Parcel = model("Parcel", parcelSchema);
