import {Schema, model} from 'mongoose'

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    }, // Either this or that or both hence these entries are not required
    image: {
        type: String,
    }
    
}, {
    timestamps: true
})

export const Message = model('Message', messageSchema)