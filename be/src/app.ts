import 'dotenv/config';
import express from 'express';

import { errorHandler } from './middlewares/error-handler';
import shortnerRouter from './shortner/shortner.router';

const app = express();

const { PORT } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(shortnerRouter);

app.use(errorHandler);

const run = async () => {
  try {
    app.listen(PORT, () => {
      console.log('Started on', PORT);
    });
  } catch (error) {
    console.error(error);
  }
};

run();
