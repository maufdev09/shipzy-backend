import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, role, ...rest } = payload;

  if (role) {
    if (role === Role.ADMIN) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to Register as Admin"
      );
    }
  }

  const ifUserExists = await User.findOne({ email });

  if (ifUserExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User already exists with this emaila"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUNDS)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auth: [authProvider],
    role: role,
    ...rest,
  });

  return user;
};
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExists = await User.findById(userId);

  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (payload.role) {
    if (
      decodedToken.role === Role.SENDER &&
      decodedToken.role !== Role.RECEIVER
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to update user role"
      );
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You are not allowed to update isActive, isDeleted or isVerified fields"
    );
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password as string,
      Number(envVars.BCRYPT_SALT_ROUNDS)
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const getAllUser = async () => {
  const user = await User.find();
  const total = await User.countDocuments();

  return { user, total };
};

export const UserService = {
  createUser,
  getAllUser,
  updateUser,
};
