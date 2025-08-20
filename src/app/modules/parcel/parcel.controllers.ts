import { JwtPayload } from 'jsonwebtoken';
import { catchAsync } from '../../utils/catchAsync';
import { SendResponse } from '../../utils/sendResponse';
import { Parcel } from './parcel.model';
import { ParcelService } from './parcel.service';
import { IParcel } from './parcel.interface';



const createParcel= catchAsync(async(req, res, next) => {
    const  parcel =await ParcelService.createParcel(req.body);
    SendResponse(res,{
        statusCode: 201,
        success: true,
        message: "Parcel created successfully",
        data: parcel,
    })
})

const cancelParcel= catchAsync(async(req, res, next) => {


const  Id  = req.params.id;

    const verifiedToken = req.user as JwtPayload; 

    const parcel = await ParcelService.cancelParcel(Id, verifiedToken);

     SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    })
})
const senderParcel= catchAsync(async(req, res, next) => {

    if (!req.user) {
        return next(new Error("User not authenticated"));
    }
    const verifiedToken = req.user as Partial<IParcel>;

    const parcel = await ParcelService.senderParcel(verifiedToken);

     SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    })
})
const receiverParcel= catchAsync(async(req, res, next) => {


    const verifiedToken = req.user as Partial<IParcel>

    const parcel = await ParcelService.receiverParcel( verifiedToken);

     SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    })
})
const confirmParcel= catchAsync(async(req, res, next) => {


  const  Id  = req.params.id;

    const verifiedToken = req.user as Partial<IParcel>

    const parcel = await ParcelService.confirmParcel(Id, verifiedToken);


     SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    })
})
const statuslogParcel= catchAsync(async(req, res, next) => {


  const  Id  = req.params.id;

    const verifiedToken = req.user as Partial<IParcel>

    const parcel = await ParcelService.statuslogParcel(Id, verifiedToken);


     SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    })
})
const allParcels= catchAsync(async(req, res, next) => {


 

    const parcel = await ParcelService.allParcels();


     SendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Parcel canceled successfully",
        data: parcel,
    })
})

export const ParcelControllers = {
    createParcel,
    cancelParcel,
    senderParcel,
    receiverParcel,
    confirmParcel,
    statuslogParcel,
    allParcels
} 