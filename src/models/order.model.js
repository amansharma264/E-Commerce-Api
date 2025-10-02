import mongoose, { mongo } from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    priceAtPurchase:{
        type: Number,
        required: true
    }
},
{
    _id: false
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    stripeSessionId: {
        type: String
    }
},
{
    timestamps: true
})

export const Order = mongoose.model('Order', orderSchema);