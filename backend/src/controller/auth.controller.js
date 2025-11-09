import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { genToken } from "../lib/jwtToken.js";

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Create the user
      console.log("Creating user...")
      await newUser.save();

      //Gen the token, and include in Cookies
      console.log("User created successfully")
      genToken(newUser._id, res);

      res.status(201).json({
         message: "User created successfully",
         user_id: newUser._id,
         fullName: newUser.fullName,
         email: newUser.email,
         profilePic: newUser.profilePic,
        });
    } else {
      return res.status(400).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const userExist = await User.findOne({email: email})

        if (!userExist){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        const isPasswordValid = await bcryptjs.compare(password, userExist.password)

        if (!isPasswordValid){
            res.status(400).json({message: "Invalid Credentials"})
        }

        if (userExist && isPasswordValid){
            genToken(userExist._id, res)
            res.status(200).json({
                message: "User logged in successfully",
                user_id: userExist._id,
                fullName: userExist.fullName,
                email: userExist.email,
                profilePic: userExist.profilePic,
            })
        }
    } catch (error) {
        console.log("Error has occured while logging user in: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
  
};

export const logOut = (req, res) => {
try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      res.status(200).json({ message: "User logged out successfully" });
} catch (error) {
    console.log("Error has occured while logging user out: ", error);
    res.status(500).json({ message: "Internal server error" });
    }
};
