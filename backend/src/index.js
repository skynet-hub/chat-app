import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

//Routes
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
app.use("/api/auth", authRoute);
app.use("api/messages", messageRoute)

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Listening on port PORT: ${PORT}`);
  connectDB();
});
