import mongoose from "mongoose";

const productSchema = new mongoose.model({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    image:[{
        type:String
    }],
    category: {
        type: String
    }
});

export const Product = mongoose.model('Product', productSchema);