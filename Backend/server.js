import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/db.js";

import  authRoutes  from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
  connectDB();
});
