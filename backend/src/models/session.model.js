import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    res_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true, 
    },
    restaurant_name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    contact_no:{
        type: String,
        required: true,
    },  
    address:{
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String},
        zip: { type: Number, required: true }
    },
    status:{
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'archived'],
        default: 'pending',
        required: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },

});

const Session = mongoose.model('Session', sessionSchema);

export default Session;