/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/error.types"

export const handlerCastError = (err: mongoose.Error.CastError):TGenericErrorResponse => {

return{
  statusCode : 400,
  message : `Invalid mongoDB ObjectId. Please provide a valid Id`,
}
}