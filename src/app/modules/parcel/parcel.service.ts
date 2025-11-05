/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from "./../user/user.interface";
import httpStatus from "http-status-codes";
import { IParcel, TParcelStatus } from "./parcel.interface";
import { Parcel } from "./parcel.model";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

const createParcel = async (payload: Partial<IParcel>) => {
  const statusLog = {
    status: TParcelStatus.REQUESTED,
    timestamp: new Date(),
    location: payload.senderAddress,
    updatedBy: "System",
  };

  const parcel = await Parcel.create({
    ...payload,
    statusLog: [statusLog],
  });

  return parcel;
};

const cancelParcel = async (Id: string, decodedToken: JwtPayload) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const parcel = await Parcel.findById(Id).session(session);

    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
    }

    if (
      parcel.sender.toString() !== decodedToken.userId &&
      decodedToken.role !== Role.ADMIN
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to cancel this parcel"
      );
    }

    if (parcel.isBlocked || parcel.isDeleted) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You are not allowed to update isBlocked or isDeleted fields"
      );
    }

    if (
      parcel.status === TParcelStatus.APPROVED ||
      parcel.status === TParcelStatus.REQUESTED
    ) {
      const statusLog = {
        status: TParcelStatus.CANCELED,
        timestamp: new Date(),
        location: parcel.senderAddress,
        updatedBy: `${decodedToken.role}`,
      };

      if (!parcel.statusLog) {
        parcel.statusLog = [];
      }
      parcel.statusLog.push(statusLog);
      parcel.status = TParcelStatus.CANCELED;
      parcel.isBlocked = true;
      parcel.isDeleted = true;
      await parcel.save({ session });
      await session.commitTransaction();
      session.endSession();

      return parcel;
    }
    throw new AppError(httpStatus.BAD_REQUEST, "You Cant cancel the parcel");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getParcelOverview = async () => {
  const totalParcel = await Parcel.countDocuments();
  const delivered = await Parcel.countDocuments({
    status: `${TParcelStatus.DELIVERED}`,
  });
  const inTransit = await Parcel.countDocuments({
    status: `${TParcelStatus.IN_TRANSIT}`,
  });
  const pending = await Parcel.countDocuments({
    status: {
      $in: [`${TParcelStatus.REQUESTED}`, `${TParcelStatus.CANCELED}`],
    },
  });

  const data = { totalParcel, delivered, inTransit, pending };

  return data;
};

const getStatusDistrubution = async () => {
  const result = await Parcel.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  return result;
};

const senderParcel = async (payload: any) => {
  const userId = payload.userId;
  const parcel = await Parcel.find({ sender: userId });

  return parcel;
};
const receiverParcel = async (payload: any) => {
  const { userId } = payload;
  const parcel = await Parcel.find({ receiver: userId }).populate("sender");

  return parcel;
};

const confirmParcel = async (Id: string, decodedToken: JwtPayload) => {
  const IfparcelExist = await Parcel.findById(Id);

  if (!IfparcelExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (
    IfparcelExist.receiver.toString() !== decodedToken.userId &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to confirm this parcel"
    );
  }

  if (
    IfparcelExist.isBlocked ||
    IfparcelExist.isDeleted ||
    IfparcelExist.status === TParcelStatus.CANCELED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not allowed to confirm isBlocked or isDeleted or cancaled parcel"
    );
  }

  if (
    IfparcelExist.status === TParcelStatus.APPROVED ||
    IfparcelExist.status === TParcelStatus.REQUESTED
  ) {
    const statusLog = {
      status: TParcelStatus.DELIVERED,
      timestamp: new Date(),
      location: IfparcelExist.senderAddress,
      updatedBy: `${decodedToken.role}`,
    };
    if (!IfparcelExist.statusLog) {
      IfparcelExist.statusLog = [];
    }
    IfparcelExist.statusLog.push(statusLog);
    IfparcelExist.status = TParcelStatus.DELIVERED;
    const parcel = await IfparcelExist.save();

    return parcel;
  }
  throw new AppError(httpStatus.BAD_REQUEST, "Your delivered Successfully");
};

const statuslogParcel = async (Id: string, decodedToken: JwtPayload) => {
  const IfparcelExist = await Parcel.findById(Id);

  if (!IfparcelExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  }

  if (
    IfparcelExist.receiver.toString() !== decodedToken.userId &&
    IfparcelExist.sender.toString() !== decodedToken.userId &&
    decodedToken.role !== Role.ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to get parcel status log "
    );
  }
  //

  if (IfparcelExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "sorry! the parcel was deleted");
  }

  const statusLog = await Parcel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(Id) } },
    {
      $project: {
        _id: 1,
        trackingId: 1,
        status: 1,
        statusLog: {
          $sortArray: { input: "$statusLog", sortBy: { timestamp: -1 } },
        },
      },
    },
  ]);

  return statusLog;
};

const allParcels = async () => {
  const parcel = await Parcel.find();

  return parcel;
};



export const ParcelService = {
  createParcel,
  cancelParcel,
  senderParcel,
  receiverParcel,
  confirmParcel,
  statuslogParcel,
  allParcels,
  getStatusDistrubution,
  getParcelOverview,
};
