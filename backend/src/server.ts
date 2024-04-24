import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import usersRouter from "./routes/users.route";
import authRouter from "./routes/auth.route";
import { notFound, errorHandler } from "./middlewares/error.middleWare";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import { corsOptions } from "./config/cors-config";
import dbConnect from "./config/dbConnect";
// @ts-ignore
// import swaggerDocument from "../swagger.json" assert { type: "json" };

const port = process.env.PORT || 5000;

const app = express();

dbConnect();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // hide tech stack
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// define route path
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
// app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
// Error handling middleware for Prisma errors
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});
