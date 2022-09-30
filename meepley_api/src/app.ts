import 'dotenv/config';
import fs from 'fs';
import path from 'path';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import chalk from 'chalk';

import routes from './routes';
import logger from './utils/logger';
import errHandler from './middleware/error-handler';
import rateLimiter from './config/rateLimiter';
import { port } from './utils/constants';

console.log(chalk.yellow('setting up server... ⏲️'));

const app = express();

//* setup logging, cors, helmet and parsing in the API
try {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/express-access.log'),
    {
      flags: 'a',
    },
  );
  app.use(morgan('combined', { stream: accessLogStream }));
} catch (err) {
  logger.error('error setting up morgan loggin =>', err);
  console.log(chalk.red(`morgan logging setup err =>`, err));
}
app.use(cors());
app.use(helmet());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* setup rate limiter
app.use(rateLimiter);

//* define the routes for the API
app.use('/', routes);

//* setup error handler
app.use(errHandler);

//* run the API
app.listen(port, () => {
  console.log(chalk.green.bold(`server started on localhost:${port} 🚀`));
});
