import 'dotenv/config';
import express from 'express';

import { errorHandler } from './middlewares/error-handler';

const app = express();

const { PORT } = process.env;

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
