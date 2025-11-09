import User from "../models/user.model.js"
import { Message } from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"

const getUsers = async (req, res) => {
    try {
        const loggedInuser = req.user
        const filteredUsers = await User.find({_id: {$ne: loggedInuser._id}})
        res.status(200).json(filteredUsers)       
    } catch (error) {
        console.log("Error has occured while getting users: ", error)
        res.status(500).json("Internal server error")
    }
}

const getMessages = async (req, res) => {
    try {
        const {id:receiverId} = req.params
        const senderId = req.user._id
        
        const messages = await Message.find({
            $or: [
                {senderId, receiverId},
                {senderId: receiverId, receiverId: senderId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error has occured while getting messages: ", error)
        res.status(500).json("Internal server error")
    }
}

const sendMessage = async (req, res) => {
    try {
        const myId = req.user._id
        const {id:receiverId} = req.params
        const {text, image} = req.body
    
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url   
        }
    
        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
            image: imageUrl
        })
    
        await newMessage.save()

        // todo: Realtime will go in here using socket.io

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error has occured while sending message: ", error)
        res.status(500).json("Internal server error")
    }
}

export {getUsers, getMessages, sendMessage}