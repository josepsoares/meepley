import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import filterCategories from './helpers/filterCategories';

const categories = [];

(async () => {
  try {
    console.log(chalk.magenta('launching puppeteer... 🚀'));

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);

    await page.goto('https://boardgamegeek.com/browse/boardgamecategory', {
      waitUntil: 'networkidle0',
    });

    console.log(
      chalk.magenta(
        'now at the boardgamegeek boardgame categories page, starting to scrape shortly...',
      ),
    );

    console.log(chalk.yellow('getting rows of the categories table... 🤖'));
    const categoriesRows = await page.$$('table.forum_table > tbody td');

    //* loop through the rows which have the categories
    for await (const row of categoriesRows) {
      const { categoryName, categoryBggLink } = await row.$eval('a', (el) => {
        return {
          categoryName: el.textContent,
          categoryBggLink: el.getAttribute('href'),
        };
      });

      const categoryBggId = parseInt(categoryBggLink.split('/')[2]);

      console.log('>>> NAME =>', categoryName);
      console.log('>>> BGG LINK =>', categoryBggLink);
      console.log('>>> BGG ID =>', categoryBggId);

      if (!filterCategories.includes(categoryName)) {
        //* store all the gathered data from the category to the array
        categories.push({
          name: categoryName,
          bgg_id: categoryBggId,
          bgg_link: categoryBggLink,
        });

        console.log(
          chalk.green.bold(
            `Category - ${categoryName} - saved with success ✔️`,
          ),
        );
      } else {
        console.log(
          chalk.yellow.bold(
            `Category - ${categoryName} - was filtered and not saved ❌`,
          ),
        );
      }
    }

    //* after scraping every relevant category we store them in a single .json file
    fs.writeFileSync(
      path.resolve(__dirname, '../../data/bgg_categories.json'),
      JSON.stringify(categories, null, 2),
    );

    //* scraping completed with success
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
