import chalk from 'chalk';
import path from 'path';
import * as XLSX from 'xlsx';
import prisma from '../../../src/clients/prisma';

const Achievements: {
  name: string;
  requirement: string;
  difficulty: string;
  type: string;
  secret: boolean;
}[] = [];

const AchievementTypes = [
  { name: 'Local', icon: 'location' },
  { name: 'Partida', icon: 'matchroom' },
  { name: 'Especial', icon: 'special' },
  { name: 'Social', icon: 'social' },
  { name: 'Boardgame', icon: 'boardgame' },
  { name: 'Comunidade', icon: 'community' },
];

const AchievementDifficulties = [
  { name: 'Fácil', color: '#FFAA5C' },
  { name: 'Média', color: '#C6C6C6' },
  { name: 'Difícil', color: '#ECB800' },
  {
    color: '#6C7AFB',
    name: 'Muito Difícil',
  },
];

const achievementsSeeder = async () => {
  console.log(chalk.yellow('getting achievements data... 🏅'));

  //* get achievements from xlsx (excel) file
  const file = XLSX.readFile(
    path.resolve(__dirname, '../data/meepley_xlsx_achievements.xlsx'),
  );

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach(
      (res: {
        name: string;
        requirement: string;
        difficulty: string;
        type: string;
        secret: string;
      }) => {
        const getSecret = res.secret === 'true' ? true : false;

        Achievements.push({
          name: res.name,
          requirement: res.requirement,
          difficulty: res.difficulty,
          type: res.type,
          secret: getSecret,
        });
      },
    );
  }

  console.log(chalk.yellow('starting seeding achievements... 🌱'));

  //* seed achievements
  //* we create the achievement types and difficulties while we insert the achivements
  //* in order to not get errors
  //* https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record
  for await (const achievement of Achievements) {
    //* get achievement difficulty item and id to create or connect with the id in the existing table
    let difficultyIndex = AchievementDifficulties.findIndex(
      (item) => achievement.difficulty === item.name,
    );
    const difficulty = AchievementDifficulties.find(
      (item) => achievement.difficulty === item.name,
    );

    //* get achievement type item and id to create or connect with the id in the existing table
    let typeIndex = AchievementTypes.findIndex(
      (item) => achievement.type === item.name,
    );
    const type = AchievementTypes.find(
      (item) => achievement.type === item.name,
    );

    await prisma.achievement.create({
      data: {
        name: achievement.name,
        requirement: achievement.requirement,
        secret: achievement.secret,
        difficulty: {
          connectOrCreate: {
            where: { id: (difficultyIndex += 1) },
            create: difficulty,
          },
        },
        type: {
          connectOrCreate: {
            where: { id: (typeIndex += 1) },
            create: type,
          },
        },
      },
    });
  }

  console.log(chalk.green('seeded ACHIEVEMENTS related tables ✔️'));
};

export default achievementsSeeder;
