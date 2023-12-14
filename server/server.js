import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import userRouter from "./Routes/UserRouter.js";
import globalError from "./Controllers/ErrorController.js";
import { deleteUnverifiedAccounts } from './Controllers/AuthController.js';
import cron from 'node-cron';

dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ExpressMongoSanitize());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(express.static("public"));


/*ROUTES*/
app.use("/api", userRouter);

/*ERROR */
app.all("*", (req, res, next) => {
  const err = new Error(`Not Found ${req.originalUrl} on this server`);
  err.statusCode = 404;
  res.status(404).json({ status: "error", error: err });
});
app.use(globalError);

const db = process.env.BASE_URL.replace("<password>", process.env.PASSWORD_URL);
mongoose
  .connect(db)
  .then(() => {
    console.log("Connected to Mongoose database ");
    cron.schedule('*/5 * * * *', async () => {
      await deleteUnverifiedAccounts();
    });
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

deleteUnverifiedAccounts();

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("listening on port " + port);
});
