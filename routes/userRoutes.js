import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import User from '../models/User.js';
import { auth } from "../middleware/auth.js";
import { client } from '../config/redis.js';

const router = Router();

const SECRET_KEY = process.env.SECRET_KEY || 'secretKey';

router.post('/login', async (req, res)=> {
    try {
        const { message, address, signature } = req.body;
        const addressThatSignedData = ethers.utils.verifyMessage(message, signature);
        const isVerified = addressThatSignedData.toLowerCase() === address.toLowerCase();

        if (!isVerified){
            return res.status(401).json({ error: 'Invalid Signature'});
        }

        const token = jwt.sign({address}, SECRET_KEY);

        let user = await User.findOne({ walletAddress: address });

        if (!user){
            user = await User.create({
                balance: '0',
                walletAddress: expected,
                signature,
            });
        }

        const userId = await client.get(token);
        if (!userId){
            await client.set(token, user._id.toString());
        }

        res.status(200).json({token, user})
    }catch (e) {
        res.status(400).json({ error: { message: 'something went wrong' } })
    }
});

router.get('/verify', auth, async (req, res)=> {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        res.json({ user })
    }catch (e) {
        res.status(400).json({ error: { message: 'something went wrong' } })
    }
});

router.put('/', auth, async (req, res)=> {
    try {
        const { balance } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        user.balance = balance;
        await user.save();

        res.status(200).json({user});
    }catch (e) {
        res.status(400).json({ error: { message: 'something went wrong' } })
    }
});

export default router;
