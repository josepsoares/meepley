import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import prisma from '../../../src/clients/prisma';
import { getMostRecentFile } from '../../../src/utils/helpers/files';

const BoardgameSkills = [
  { name: 'Iniciante', emoji: '🐣' },
  { name: 'Médio', emoji: '🦸' },
  { name: 'Avançado', emoji: '🧙' },
];

const boardgamesSeeder = async () => {
  console.log(chalk.yellow('getting boardgames data... 🎲'));

  const bgCategoriesData = fs.readFileSync(
    path.resolve(process.cwd(), './src/puppeteer/data/bgg_categories.json'),
    'utf8',
  );
  const bgMechanicsData = fs.readFileSync(
    path.resolve(process.cwd(), './src/puppeteer/data/bgg_mechanics.json'),
    'utf8',
  );
  const bgsData = fs.readFileSync(
    path.resolve(
      process.cwd(),
      `./src/puppeteer/data/bgg_rankings/${getMostRecentFile(
        './src/puppeteer/data/bgg_rankings',
      )}`,
    ),
    'utf8',
  );

  const BoardgameCategories = JSON.parse(bgCategoriesData);
  const BoardgameMechanics = JSON.parse(bgMechanicsData);
  const Boardgames = JSON.parse(bgsData);

  console.log(chalk.yellow('starting seeding boardgames... 🌱'));

  //* seed boardgame skills
  await prisma.boardgameSkill.createMany({
    data: BoardgameSkills,
  });

  //* seed boardgame categories
  await prisma.boardgameCategory.createMany({
    data: BoardgameCategories,
  });

  //* seed boardgame mechanics
  await prisma.boardgameMechanic.createMany({
    data: BoardgameMechanics,
  });

  //* seed actual boardgames
  for await (const bg of Boardgames) {
    const { categories, mechanics, ...bgProps } = bg;
    await prisma.boardgame.create({
      data: {
        ...bgProps,
        categories: {
          create: categories.map((name) => {
            //* get bg category to connect with the id in the existing table
            let index = BoardgameCategories.findIndex(
              (item) => item.name === name,
            );
            return {
              category: {
                connect: {
                  id: (index += 1),
                },
              },
            };
          }),
        },
        mechanics: {
          create: mechanics.map((name) => {
            //* get bg mechanic to connect with the id in the existing table
            let index = BoardgameMechanics.findIndex(
              (item) => item.name === name,
            );
            return {
              mechanic: {
                connect: {
                  id: (index += 1),
                },
              },
            };
          }),
        },
      },
    });
  }

  console.log(chalk.green('seeded BOARDGAMES related tables ✔️'));
};

export default boardgamesSeeder;
