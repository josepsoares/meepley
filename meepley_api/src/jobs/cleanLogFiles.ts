import * as schedule from 'node-schedule';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

const cleanLogFilesJob = () => {
  console.log(chalk.yellow('cleaning log files... 🧹'));
  fs.writeFile(
    path.join(__dirname, '../../logs/express-access.log'),
    '',
    (err) => {
      if (err) throw err;
    },
  );
  fs.writeFile(path.join(__dirname, '../../logs/info.log'), '', (err) => {
    if (err) throw err;
  });
  fs.writeFile(path.join(__dirname, '../../logs/error.log'), '', (err) => {
    if (err) throw err;
  });

  console.log(chalk.green('logs files cleaned successfully... ✔️'));
};

export default cleanLogFilesJob;
