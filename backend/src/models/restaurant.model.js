import mongoose ,{Schema} from "mongoose";

const resSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email: {
            type: String,
            required: [true,'Email address is required'],
            unique: true,
            lowecase: true,
            trim: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
        },
        res_id:{
            type:Number,
            required:[true,'Id is required'],
            unique:true
        },
        contact_no:{
            type:String,
            required:[true,'Phone number is required'],
            trim:true,
            match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number']

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
        }

    },
    {
        timestamps:true
    }
)

module.exports= mongoose.model("Restaurant",resSchema);