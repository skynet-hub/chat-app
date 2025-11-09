import { Router } from "express";
import { signUp, logIn, logOut, updateProfile, checkAuth} from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";


const route = Router()

route.post("/signup", signUp)
route.post("/login", logIn)
route.post("/logout", logOut)

route.put("/update-profile", protectedRoute, updateProfile)
route.get("/check-auth", protectedRoute, checkAuth)


export default route