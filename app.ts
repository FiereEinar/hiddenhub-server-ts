import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFoundHandler } from './src/middlewares/not-found';
import { errorHandler } from './src/middlewares/error';
dotenv.config();

const app = express();
app.use(cors());

import connectToDB from './src/database/mongodb';
connectToDB();

// routers
import authRouter from './src/routes/auth';

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/auth', authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => console.log('Server is running on PORT 3000'));
