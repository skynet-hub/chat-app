import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsers, getMessages, sendMessage } from "../controller/message.controller.js";

const route = Router()

route.get("/users", protectedRoute, getUsers)
route.get("/:id", protectedRoute, getMessages)
route.post("/send/:id", protectedRoute, sendMessage)

export default route;