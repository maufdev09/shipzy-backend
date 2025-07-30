import dotenv from "dotenv";

dotenv.config();

interface Envconfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development"|"production";
}

const loadEnvVar = (): Envconfig => {
  const requiredEnvVars: string[] = ["PORT", "DB_URL", "NODE_ENV"];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required enviorment variable ${key} `);
    }
  });
 
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development"|"production",
  };
};
console.log(process.env.PORT);




export const envVars=loadEnvVar()