import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const validToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!validToken){
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(validToken.userId);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }



        req.user = user
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
    
}
