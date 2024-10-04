import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from './src/middlewares/not-found';
import { errorHandler } from './src/middlewares/error';
dotenv.config();

const FRONTEND_URL =
	process.env.NODE_ENV === 'production'
		? 'https://messenger-app-blond.vercel.app'
		: 'http://localhost:5173';

const app = express();
app.use(
	cors({
		origin: FRONTEND_URL,
		credentials: true,
	})
);

import connectToDB from './src/database/mongodb';
connectToDB();

// routers
import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import messageRouter from './src/routes/message';
import groupRouter from './src/routes/group';

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/group', groupRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => console.log('Server is running on PORT 3000'));

export default app;
