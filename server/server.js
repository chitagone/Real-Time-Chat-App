import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import errorHandler from "./src/helpers/errorhandler.js";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Fixed typo here
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Fixed typo here
app.use(cookieParser());

// Routes
const routeFiles = fs.readdirSync("./src/routes");
routeFiles.forEach((file) => {
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((error) => {
      console.log(`Failed to load route file`, error);
    });
});

// Error handler middleware should be the last middleware
app.use(errorHandler);

const server = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log("Failed to start server...", error.message);
    process.exit(1);
  }
};

server();
