import { execFile } from 'child_process';
import * as schedule from 'node-schedule';
import chalk from 'chalk';

const scrapeBggRankingJob = schedule.scheduleJob('* * 1 * *', async () => {
  console.log(
    chalk.yellow('scraping bgg ranking to see if there are new games... 🤖'),
  );

  execFile(
    __dirname + '../commands/bggRankScrapper.sh',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`error while starting scrapper: ${error.message}`);
        return;
      }

      if (stderr) {
        console.log(chalk.red('error while starting scrapper'));

        console.error(`stderr: ${stderr}`);
        return;
      }

      console.log(
        chalk.green('bgg ranks scraping started successfully ... 🎉'),
      );
    },
  );
});

export default scrapeBggRankingJob;
