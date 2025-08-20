import {  Response } from "express";

interface Tmeta {
   
    total?: number|string;
}


interface Tresponse<T>{
    statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?:Tmeta
}


export const SendResponse=<T>(
  res: Response, data:Tresponse<T>)=>{

    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message ,
        meta: data.meta ,
        data: data.data
    });
  }

