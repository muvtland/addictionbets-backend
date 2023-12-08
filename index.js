import express from 'express';
import 'dotenv/config'
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import connectDB from './config/db.js';
const PORT = process.env.PORT || 3030;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await connectDB();
});
