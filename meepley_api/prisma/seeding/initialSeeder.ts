import chalk from 'chalk';

import prisma from '../../src/clients/prisma';
import achievementsSeeder from './seeders/achievementsSeeder';
import boardgamesSeeder from './seeders/boardgamesSeeder';
import cardsSeeder from './seeders/cardsSeeder';
import placesSeeder from './seeders/placesSeeder';
import usersSeeder from './seeders/usersSeeder';

(async () => {
  try {
    console.log(chalk.magenta('starting db seeding... 🌱'));

    //* execute boardgames seeder
    await boardgamesSeeder();

    //* execute achievements seeder
    await achievementsSeeder();

    //* execute cards seeder
    await cardsSeeder();

    //* execute places seeder
    await placesSeeder();

    //* execute users seeder
    await usersSeeder();

    //* initial seeding successful
  } catch (e) {
    console.error(chalk.red.bold(e));
    process.exit(1);
  } finally {
    console.log(chalk.green.bold('db seeded successfully 🎉'));
    await prisma.$disconnect();
  }
})();
