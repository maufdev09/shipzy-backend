/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const  user= await UserService.createUser(req.body);

   

SendResponse(res,{
  statusCode: httpStatus.CREATED,
  success: true,
  message: "User created successfully",
  data: user,
})

  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const  userId  = req.params.id;
    
    // const  token =req.headers.authorization;
    // const verifiedToken=verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    const verifiedToken = req.user as JwtPayload; // Assuming user is set by checkAuth middleware
    const payload=req.body;
    const  user= await UserService.updateUser(userId, payload, verifiedToken);

   

SendResponse(res,{
  statusCode: httpStatus.CREATED,
  success: true,
  message: "User updated successfully",
  data: user,
})

  }
);

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUser();

 SendResponse(res,{
  statusCode: httpStatus.CREATED,
  success: true,
  message: "User created successfully",
  data: result.user,
  meta: { total: result.total },
})
  }
);

export const UserControllers = {
  createUser,
  getAllUser,
  updateUser
};
