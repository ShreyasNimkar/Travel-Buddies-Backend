import express from "express";
import morgan from "morgan";
import path from "path";
import AppError from "./managers/AppError.js";
import { noURL } from "./controllers/ErrorController.js";
import userRouter from "./routers/userRouter.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import connectToDB from "./managers/DB.js";

import envHandler from "./managers/envHandler.js";
import cabRouter from "./routers/cabRouter.js";

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());
app.use(ExpressMongoSanitize());

app.use(express.static(path.join(__dirname, "public")));

if (envHandler("NODE_ENV") == "dev") app.use(morgan("dev"));

connectToDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

app.use("/users", userRouter);
app.use("/cabs", cabRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl}`, 404));
});

app.use(noURL);

export default app;
