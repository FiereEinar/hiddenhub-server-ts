import express from 'express';
import cors from 'cors';
import { notFoundHandler } from './src/middlewares/not-found';
import { errorHandler } from './src/middlewares/error';

const app = express();
app.use(cors());

// routers
import authRouter from './src/routes/auth';

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/auth', authRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => console.log("Server is running on PORT 3000"));
