import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import dayjs from 'dayjs';

import filterMechanics from './helpers/filterMechanics';
import filterCategories from './helpers/filterCategories';

function getIntVal(val) {
  const multiplier = val.substr(-1).toLowerCase();
  if (multiplier === 'k') return parseFloat(val) * 1000;
  else if (multiplier === 'm') return parseFloat(val) * 1000000;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(chalk.magenta('launching puppeteer... 🚀'));

  try {
    page.setDefaultNavigationTimeout(0);

    await Promise.all([
      page.waitForNavigation(),
      page.goto('https://boardgamegeek.com/browse/boardgame/page/1'),
    ]);

    console.log(
      chalk.magenta(
        'now at the boardgamegeek ranking page, starting to scrape shortly...',
      ),
    );

    const boardgames = [];
    let loopBoardgamesList = true;

    while (loopBoardgamesList) {
      console.log(chalk.yellow('getting rows of the ranking table... 🤖'));

      await Promise.all([page.waitForNavigation(), page.click('#c-s-bn')]);

      const bgRows = await page.$$('#collectionitems > tbody > #row_');

      for await (const [key, row] of Object.entries(bgRows)) {
        console.log(chalk.yellow('ROW ITERATOR/NUMBER =>', key));

        //* initialize variabels to store things about the boardgame
        let minPlayers: number,
          maxPlayers: number,
          avgPlayingTime: string,
          minAge: number,
          bgNumVoters: string,
          bgRating: string;

        const bgRank = await row.$eval('td.collection_rank a', (el) => {
          return el.getAttribute('name');
        });

        //* get rows of the community evaluations
        const bgGetEvaluationRows = await row.$$eval(
          'td.collection_bggrating',
          (nodes) => nodes.map((n) => n.textContent),
        );

        //* get number of ratings done by the users
        bgRating = bgGetEvaluationRows[1];
        bgRating = bgRating.replace(/\s+/g, ' ').trim();

        //* get numbers of votes from the community
        bgNumVoters = bgGetEvaluationRows[2];
        bgNumVoters = bgNumVoters.replace(/\s+/g, ' ').trim();

        //! if the number of voters has the text "N/A" then we dont want to store the boardgame
        //! thats because we reached the boardgames that aren't really acknowledged by the community
        //! so we just break and stop the for and while loop
        //* if the number of voters is more than 20 then we store the boardgame and stuff
        //* otherwise we don't do nothing and go to the next boardgame
        if (bgNumVoters === 'N/A') {
          console.log(
            chalk.red('Not enough voters, stopping the scraping process'),
          );

          loopBoardgamesList = false;
          break;
        } else if (parseInt(bgNumVoters) > 20) {
          console.log(
            chalk.green(
              '> boardgames has enough votes, starting the scraping to save its data ✔️',
            ),
          );

          await row.waitForSelector('div[id^=results_objectname] a', {
            timeout: 80000,
          });

          const { title, partialLink } = await row.$eval(
            'div[id^=results_objectname] a',
            (el) => {
              return {
                title: el.textContent,
                partialLink: el.getAttribute('href'),
              };
            },
          );

          await row.waitForSelector('div[id^=results_objectname] span', {
            timeout: 80000,
          });

          const yearReleased = await row.$eval(
            'div[id^=results_objectname] span',
            (el) => el.textContent,
          );

          const parseYear =
            typeof yearReleased === 'string'
              ? parseInt(yearReleased.replace(/[()]/g, ''))
              : yearReleased;

          const bggId = partialLink?.split('/')[2]
            ? parseInt(partialLink.split('/')[2])
            : null;

          //* create new page to get general info of boardgame in question
          //* eg. top files and images, official urls, big description, how to play and review video etc.
          const bgPage = await browser.newPage();
          bgPage.setDefaultNavigationTimeout(0);

          await Promise.all([
            bgPage.waitForNavigation(),
            bgPage.goto(`https://boardgamegeek.com/${partialLink}`),
          ]);

          //* get descriptions of the boardgame
          const bgShortDescription = await bgPage.$eval(
            'div.game-header-title-info p',
            (el) => el.textContent.replace(/\s*$/, ''),
          );
          const description = await bgPage.$eval(
            '.game-description-body > div > p:first-of-type',
            (el) => el.textContent,
          );

          //* get images of the boardgame
          const thumbnail = await bgPage.$eval(
            'div.game-header-image img',
            (el) => {
              return el.getAttribute('src');
            },
          );
          const image = await bgPage.$eval('div.game-header-image a', (el) => {
            return el.getAttribute('href');
          });

          //* get official links
          const officialUrl = await bgPage.evaluate(() => {
            const el = document.querySelector(
              'div.game-description > official-links-module > div > div.panel-body > ul > li:nth-child(1) > div.feature-description > span.ng-scope > a:nth-child(1)',
            );

            return el ? el?.getAttribute('href') : null;
          });

          const owned = await bgPage.$eval(
            'div.panel-body > div > div.game-description > div.row.col-xl-middle-border.fs-responsive-sm.ng-scope > div.col-sm-6.col-xl-7 > stats-module > div.game-stats.panel.panel-compact.ng-scope.hidden-xs > div.panel-body > div.row > div:nth-child(1) > ul > li:nth-child(1) > div.outline-item-description > a',
            (el) => el.textContent.replace(/\s/g, '').replace(/,/, '.'),
          );

          const fans = await bgPage.$eval(
            'div.game-header > div.game-header-body > div.game-header-primary-actions.hidden-game-header-collapsed > span:nth-child(3) > ng-include > div > div:nth-child(4) > geekitem-fans > span > a',
            (el) => el.textContent.replace(/\s/g, '').replace(/,/, '.'),
          );

          const difficultyRating = await bgPage.$eval(
            'gameplay-module > div > div > ul > li:nth-child(4) > div.gameplay-item-primary > span.ng-isolate-scope > span:nth-child(1)',
            (el) =>
              +el.textContent
                .replace(/\s/g, '')
                .replace(/,/, '.')
                .split('/')[0],
          );

          let difficulty: string;

          if (difficultyRating >= 0 && difficultyRating < 1) {
            difficulty = 'Bastante fácil';
          } else if (difficultyRating >= 1 && difficultyRating < 2) {
            difficulty = 'Fácil';
          } else if (difficultyRating >= 2 && difficultyRating < 3) {
            difficulty = 'Moderado';
          } else if (difficultyRating >= 3 && difficultyRating < 4) {
            difficulty = 'Difícil';
          } else if (difficultyRating >= 4 && difficultyRating < 5) {
            difficulty = 'Muito difícil';
          }

          //* create new page to navigate to the credits page of the boargame in question
          await Promise.all([
            bgPage.waitForNavigation(),
            bgPage.click(
              'div.game-header-body > div.game-header-credits.hidden-game-header-collapsed > ng-include > div > div > a',
            ),
          ]);

          //* get divs with some important info (min/max players, avg playtime, min age)
          //* which are in the div with a background image of the boardgame
          const bgGameplayItems = await bgPage.$$('li.gameplay-item');

          //* we pop the last item because it contains information about the weight of the boardgame
          //* which is irrelavant to us
          bgGameplayItems.pop();

          for await (const gameplayItem of bgGameplayItems) {
            const gameplayItemPrimary = await gameplayItem.$eval(
              'div.gameplay-item-primary',
              (el) => el.textContent,
            );

            if (gameplayItemPrimary.includes('Players')) {
              const minPlayersString = gameplayItemPrimary.split(' ');
              const getNumbers = minPlayersString.find((i) => {
                if (parseInt(i)) {
                  return i;
                }
              });

              const replace = getNumbers.replace('–', '_');
              minPlayers = parseInt(replace.split('_')[0]);
              maxPlayers = parseInt(replace.split('_')[1]);
            } else if (gameplayItemPrimary.includes('Min')) {
              const getPlaytimeNumbers = gameplayItemPrimary
                .split(' ')
                .find((i) => {
                  if (parseInt(i)) {
                    return i;
                  }
                });
              avgPlayingTime = getPlaytimeNumbers;
            } else if (gameplayItemPrimary.includes('Age')) {
              const getAge = gameplayItemPrimary.split(' ').find((i) => {
                if (parseInt(i)) {
                  return i;
                }
              });

              minAge = getAge ? parseInt(getAge.replace('+', '')) : null;
            }
          }

          const designer = await bgPage.evaluate(() => {
            const el = document.querySelector(
              'ul.outline > li:nth-child(4) > div.outline-item-description > div > div > a',
            );

            if (el) {
              return [el.textContent];
            } else {
              const returnArr = [];
              const els = document.querySelectorAll(
                'ul.outline > li:nth-child(4) > div.outline-item-description > div > div:nth-child(1) > a',
              );

              els.forEach((el) => returnArr.push(el.textContent));

              return returnArr;
            }
          });

          const artists = await bgPage.$$eval(
            'ul.outline > li:nth-child(6) > div:nth-child(2) > div > div > a',
            (el) => {
              return el.map((artist) => artist.textContent);
            },
          );

          //* get categories of the boardgame
          const categories = await bgPage.$$eval(
            'ul.outline > li:nth-child(14) > div.outline-item-description > div > div',
            (elements) =>
              elements.map((category) =>
                category.firstElementChild.textContent.replace(/\t/g, ''),
              ),
          );

          //* get mechanics of the boardgame
          const mechanics = await bgPage.$$eval(
            'ul.outline > li:nth-child(15) > div.outline-item-description > div > div',
            (elements) =>
              elements.map((mechanic) =>
                mechanic.firstElementChild.textContent.replace(/\t/g, ''),
              ),
          );

          const filteredCategories = categories.filter(
            (category) => !filterCategories.includes(category),
          );

          const filteredMechanics = mechanics.filter(
            (mechanic) => !filterMechanics.includes(mechanic),
          );

          await bgPage.close();

          //* store all the gathered data from the boardgame to the array
          boardgames.push({
            name: title,
            bgg_id: bggId,
            rank: parseInt(bgRank),
            thumbnail: thumbnail,
            image: image,
            short_description: bgShortDescription,
            description: description,
            bgg_link: partialLink,
            year_released: parseYear,
            min_players: minPlayers,
            max_players: maxPlayers,
            min_age: minAge,
            difficulty: difficulty,
            avg_playtime: avgPlayingTime,
            artists: artists,
            designers: designer,
            official_url: officialUrl,
            categories: filteredCategories,
            mechanics: filteredMechanics,
            owned: getIntVal(owned),
            fans: getIntVal(fans),
            nr_of_ratings: +bgNumVoters,
            bgg_rating: +bgRating,
          });

          console.log(
            chalk.green.bold(`Boardgame - ${title} - saved with success ✔️`),
          );

          if (parseInt(key) >= 40) {
            loopBoardgamesList = false;
            break;
          }
        }
      }

      //* boardgames from the current page are stored in the array
      //* search for the next button on the bottom right of the page to change the current page
      const nextPageSelector = 'a[title="next page"]';
      const nextPageExists = !!(await page.$(nextPageSelector));

      //! if the next button doesnt exist then we just break and stop the while loop
      //* otherwise we change page and continue to scrape boardgames
      if (!nextPageExists) {
        console.log(
          chalk.red('No next page found, stopping the scraping process'),
        );
        break;
      } else {
        await Promise.all([
          page.waitForNavigation(),
          page.click(nextPageSelector),
        ]);
      }
    }

    //* after scraping every boardgame suitable and relevant we store them in a single .json file

    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../../src/puppeteer/data/bgg_rankings/${dayjs().format(
          'YYYY_MM_DD',
        )}_bgg_ranking.json`,
      ),
      JSON.stringify(boardgames, null, 2),
    );

    //* scraping completed with success
    await browser.close();
  } catch (error) {
    console.log('ERROR =>', error);
    await browser.close();
    throw error;
  }
})();
