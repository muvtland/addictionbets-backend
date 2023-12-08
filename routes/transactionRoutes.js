import { Router } from 'express';
import { ethers } from 'ethers';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import { ABI, testNetContractAddress } from '../config/contract.js'
import { auth } from '../middleware/auth.js';
import { client } from '../config/redis.js';

const TESTNET_URL = process.env.TESTNET_URL;
const PRIVATE_KEY =  process.env.PRIVATE_KEY;
const router = Router();

const provider = new ethers.providers.WebSocketProvider(TESTNET_URL);

router.post('/withdraw', auth, async (req, res)=> {
    try {
        const { walletAddress, amount } = req.body;
        const userId = req.userId;
        const existWithdraw = await client.get(userId);

        if (existWithdraw){
            return res.status(400).json({error: { message: 'you dont access new withdraw try after 5 minutes' } })
        }
        const user = await User.findById(userId);

        if (Number(user.balance) < Number(amount)){
            return res.status(400).json({error: { message: 'Insufficient funds' } })
        }

        const signer = new ethers.Wallet(PRIVATE_KEY, provider);
        const time = Math.ceil((Date.now() + 4 * 60 * 1000) / 1000);
        const timeBet = Date.now() + 5 * 60 * 1000;
        const contractInstance = new ethers.Contract(testNetContractAddress, ABI, signer);
        let nonce = await contractInstance.callStatic.nonces(walletAddress);

        const hash = ethers.utils.solidityPack(
            ["address", "uint256", "uint256", "uint256"],
            [walletAddress, time, nonce, ethers.utils.parseUnits(amount,"ether")]
            // address, time, nonce, amount
        );

        const payloadHash = ethers.utils.keccak256(hash);
        const arrayifiedMessage = ethers.utils.arrayify(payloadHash);
        const signature = await signer.signMessage(arrayifiedMessage);
        await client.set(userId, 'withdraw', {
            EX: 60 * 5, // 5 minute
            NX: true
        });
        res.json({ signature, nonce: nonce.toString(), time: timeBet })
    }catch (e) {
        console.log(e)
        res.status(400).json({error: { message: 'something went wrong' } })
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const userId = req.userId;
        const transactions = await Transaction.find({ userId });
        res.json({ transactions });
    } catch (e) {
        res.status(400).json({ error: { message: 'something went wrong' }})
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { type, amount, coin, txHash } = req.body;
        const userId = req.userId;
        const transaction = await Transaction.create({
            userId,
            type,
            amount,
            coin,
            hash: txHash
        });

        res.json({ transaction });
    } catch (e) {
        res.status(400).json({error: { message: 'something went wrong' }})
    }
});
export default router;
