import express from "express";
import cors from "cors";
import router from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import   "./app/config/passport"; // Ensure passport strategies are loaded

const app = express();

app.use(
  expressSession({
    secret: "your-secret", // Replace with your actual secret key
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(passport.initialize());

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy",1)
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(globalErrorHandler);

app.use(notFound);
export default app;
