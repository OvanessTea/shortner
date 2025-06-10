import 'dotenv/config';
import express from 'express';

import { errorHandler } from './middlewares/error-handler';
import shortnerRouter from './shortner/shortner.router';
import userRouter from './users/user.router';
import mongoose from 'mongoose';
import { authMiddleware } from './middlewares/auth';
import cookieParser from "cookie-parser";


const app = express();

const { PORT, MONGO_URL } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(userRouter);

app.use(authMiddleware);

app.use(shortnerRouter);

app.use(errorHandler);

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL as string);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log('Started on', PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
