import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    balance: {
        type: String,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    signature: {
        type: String,
        required: true,
        unique: true,
    },
},{
    timestamps: true
});

const User = model('User', userSchema);

export default User;
