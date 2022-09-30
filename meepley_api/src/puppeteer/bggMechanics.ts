import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import filterMechanics from './helpers/filterMechanics';

const mechanics = [];

(async () => {
  try {
    console.log(chalk.magenta('launching puppeteer... 🚀'));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.goto('https://boardgamegeek.com/browse/boardgamemechanic', {
      waitUntil: 'networkidle0',
    });

    console.log(
      chalk.magenta(
        'now at the boardgamegeek boardgame mechanics page, starting to scrape shortly...',
      ),
    );

    console.log(chalk.yellow('getting rows of the mechanics table... 🤖'));
    const mechanicsRows = await page.$$('table.forum_table > tbody td');

    //* loop through the rows which have the mechanics
    for await (const row of mechanicsRows) {
      const { mechanicName, mechanicBggLink } = await row.$eval('a', (el) => {
        return {
          mechanicName: el.textContent,
          mechanicBggLink: el.getAttribute('href'),
        };
      });

      const mechanicBggId = parseInt(mechanicBggLink.split('/')[2]);

      console.log('>>> NAME =>', mechanicName);
      console.log('>>> BGG LINK =>', mechanicBggLink);
      console.log('>>> BGG ID =>', mechanicBggId);

      if (!filterMechanics.includes(mechanicName)) {
        //* store all the gathered data from the mechanic to the array
        mechanics.push({
          name: mechanicName,
          bgg_id: mechanicBggId,
          bgg_link: mechanicBggLink,
        });

        console.log(
          chalk.green.bold(
            `Mechanic - ${mechanicName} - saved with success ✔️`,
          ),
        );
      } else {
        console.log(
          chalk.yellow.bold(
            `Mechanic - ${mechanicName} - was filtered and not saved ❌`,
          ),
        );
      }
    }

    //* after scraping every relevant mechanic we store them in a single .json file
    fs.writeFileSync(
      path.resolve(__dirname, '../../data/bgg_mechanics.json'),
      JSON.stringify(mechanics, null, 2),
    );

    //* scraping completed with success
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
