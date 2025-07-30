
import mongoose from "mongoose"
import app from "./app";
import {Server} from 'http'
import { envVars } from "./app/config/env";


let server: Server

const  main= async ()=>{
try {
 await mongoose.connect(envVars.DB_URL as string)

server= app.listen(envVars.PORT,()=>{
    console.log(`app is listening on port ${envVars.PORT}`);
    
})
} catch (error) {
    console.log(error);
    
}

}



main() 

/**
 * unchanged rejection error
 * unchange rejection error
 * signal terminate sigterm
 * 
 */



process.on("unhandledRejection", (err)=>{
    console.log("unhandled Rejection detected... Server shuting down..", err);

    if (server) {
       server.close(()=>{
        process.exit(1)
       }) 
    }
    process.exit(1)
    
})

process.on("uncaughtException", (err)=>{
    console.log("uncaughtException detected... Server shuting down..", err);

    if (server) {
       server.close(()=>{
        process.exit(1)
       }) 
    }
    process.exit(1)
    
})


process.on("SIGTERM", ()=>{
    console.log("SIGTERM detected... Server shuting down..", );

    if (server) {
       server.close(()=>{
        process.exit(1)
       }) 
    }
    process.exit(1)
    
})


process.on("SIGINT", ()=>{
    console.log("grace fully Server shuting down..", );

    if (server) {
       server.close(()=>{
        process.exit(1)
       }) 
    }
    process.exit(1)
    
})

// Promise.reject(new Error("I forgot to catch this promise"))
// throw new Error("local error")
