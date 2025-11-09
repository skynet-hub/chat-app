import { Router } from "express";
import { signUp, logIn, logOut } from "../controller/auth.controller.js";

const route = Router()

route.post("/signup", signUp)
route.post("/login", logIn)
route.post("/logout", logOut)


export default route