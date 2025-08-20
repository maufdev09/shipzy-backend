import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookies";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";
import passport, { use } from "passport";
import { access } from "fs";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loggedInfo = await AuthService.credentialsLogin(req.body);

passport.authenticate("local", async(err:any,user:any, info:any )=>{

  if (err) {
  return next(new AppError(401,err))
}
if (!user) {
  return next(new AppError(401, info.message))
}

console.log(`User: ${user}`);

const userTokens= await createUserTokens(user)

  const { password: pass, ...rest } = user.toObject();



 setAuthCookie(res, userTokens);

    SendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User logged in successfully",
      data:{
        accessToken: userTokens.accessToken,  
        refreshToken: userTokens.refreshToken,
user: rest
      } ,
    });
})(req,res,next)
   
  }
);


const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const TokenInfo = await AuthService.getNewAccessToken(refreshToken);

    if (!TokenInfo.accessToken) {
      return next(
        new AppError(httpStatus.UNAUTHORIZED, "No access token found")
      );
    }

    setAuthCookie(res, TokenInfo);

    SendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User logged in successfully",
      data: TokenInfo,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken",{
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax", // Adjust as needed
    });
    res.clearCookie("refreshToken",{
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax", // Adjust as needed
    });

    SendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

const oldPassword = req.body.oldPassword;
const newPassword = req.body.newPassword;
const decodedToken = req.user as JwtPayload;
console.log(oldPassword, newPassword, decodedToken);


 await AuthService.resetPassword(
  oldPassword, newPassword, decodedToken
);

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password reset successfully",
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string :"";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

const user = req.user;
if (!user) {
      return next(new AppError(httpStatus.NOT_FOUND, "User not found"));}

const tokenInfo=  createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    // SendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "Password reset successfully",
    //   data: null,
    // });

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
googleCallbackController
};
