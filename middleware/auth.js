import jwt from 'jsonwebtoken';
import { client } from '../config/redis.js';
const SECRET_KEY = process.env.SECRET_KEY;
export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({ error: { message: 'invalid token' } });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime){
            await client.del(token);
            return res.status(401).json({ error: { message: 'token Expired' } });
        }
        const userId = await client.get(token);
        if (!userId){
            return res.status(400).json({ error: { message: 'something went wrong' } });
        }
        req.userId = userId;
        next();
    }catch (e) {
        return res.status(400).json({ error: { message: 'something went wrong' } });
    }
}
