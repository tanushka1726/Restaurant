import mongoose from "mongoose";

const resSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
        },
        contact_no: {
            type: String,
            trim: true,
            match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']
        },
        description: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String,
            default: ""
        },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            zip: { type: Number, required: true }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed', 'archived'],
            default: 'pending',
            lowercase: true
        }
    },
    {
        timestamps: true
    }
);

const Restaurant = mongoose.model("Restaurant", resSchema);
export default Restaurant;