import { Schema, model } from 'mongoose';


const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw'],
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    coin: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
},{
    timestamps: true
});

const Transaction = model('Transaction', transactionSchema);

export default Transaction;
