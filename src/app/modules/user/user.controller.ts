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
    console.log(payload);
    
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
  message: "User retrieved successfully",
  data: result.user,
  meta: { total: result.total },
})
  }
);
const getAllReceiver = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await UserService.getAllReceiver();

 SendResponse(res,{
  statusCode: httpStatus.CREATED,
  success: true,
  message: "User retrieved successfully",
  data: result.user,
  meta: { total: result.total },
})
  }
);



const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserService.getMe(decodedToken.userId);

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    SendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    })
})


export const UserControllers = {
  createUser,
  getAllUser,
  updateUser,
  getMe,
  getAllReceiver
};
