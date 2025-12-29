import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path"


app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.urlencoded({ extended: true }));

dotenv.config();

const __dirname = path.resolve() 

//Routes
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoute)

if (process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
  })
} 

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Listening on port PORT: ${PORT}`);
  connectDB();
});
