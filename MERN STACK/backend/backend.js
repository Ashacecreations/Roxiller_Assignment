import dotenv from'dotenv';
import express from 'express';
import cors from 'cors';

import connectMongo from './db/connectMongoose.js';
import router from './routes/routes.js';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/roxiler', router);

app.listen(PORT, () => {
    connectMongo();
    console.log(`Server is running on port ${PORT}`);
});
