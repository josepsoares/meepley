import chalk from 'chalk';
import path from 'path';
import * as XLSX from 'xlsx';
import prisma from '../../../src/clients/prisma';

const Cards = [];

const CardRarities = [
  {
    name: 'Comum',
    chance: 55,
    stock: 100000,
    gradient: ['#838383', '#C6C6C6', '#FFFFFF'],
    discount_value: null,
  },
  {
    name: 'Incomum',
    chance: 30,
    stock: 100000,
    gradient: ['#B18B04', '#ECB800', '#FFFAE9'],
    discount_value: null,
  },
  {
    name: 'Rara',
    chance: 10,
    stock: 5000,
    gradient: ['#313B96', '#6C7AFB', '#DEE1FF'],
    discount_value: null,
  },
  {
    name: 'Holográfica',
    chance: 10,
    stock: 5000,
    gradient: [
      '#F093D4',
      '#CCF5EC',
      '#C8ABDA',
      '#F4EBAD',
      '#BBBEC9',
      '#F7CCA9',
    ],
    discount_value: null,
  },
  {
    name: 'Rainbow',
    chance: 0.5,
    stock: 100,
    gradient: [
      '#FF0000',
      '#FFD300',
      '#A1FF0A',
      '#0AEFFF',
      '#147DF5',
      '#BE0AFF',
    ],
    discount_value: null,
  },
];

const CardAttributes = [
  { name: 'Earth', color: '#93B25E' },
  { name: 'Fire', color: '#E05353' },
  { name: 'Water', color: '#538CE0' },
  { name: 'Air', color: '#53CFE0' },
  { name: 'Culture', color: '#F0BB00' },
  { name: 'Tech', color: '#47C93B' },
  { name: 'Nature', color: '#79B25E' },
  { name: 'Soul', color: '#9790C1' },
];

const cardsSeeder = async () => {
  console.log(chalk.yellow('getting cards data... 🗃️'));

  const file = XLSX.readFile(
    path.resolve(__dirname, '../data/meepley_xlsx_cards.xlsx'),
  );

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
    temp.forEach(
      (res: {
        name: string;
        description: string;
        image: string;
        attributes: string;
        rarity: string;
      }) => {
        const card = {
          ...res,
          attributes: res.attributes.split(','),
        };
        Cards.push(card);
      },
    );
  }

  console.log(chalk.yellow('starting seeding cards... 🌱'));

  await prisma.cardAttribute.createMany({
    data: CardAttributes,
  });

  //* seed cards
  //* we create the card rarities while we insert the achivements
  //* in order to not get errors
  //* https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record
  for await (const card of Cards) {
    let rarityIndex = CardRarities.findIndex(
      (item) => card.rarity === item.name,
    );

    const rarity = CardRarities.find((item) => card.rarity === item.name);

    await prisma.card.create({
      data: {
        name: card.name,
        image: card.image,
        description: card.description,
        external_url: card?.external_url || null,
        rarity: {
          connectOrCreate: {
            where: { id: (rarityIndex += 1) },
            create: rarity,
          },
        },
        attributes: {
          create: card.attributes.map((cardAttr) => {
            //* get card attribute index to connect with the id in the existing table
            let attributeIndex = CardAttributes.findIndex(
              (item) => item.name === cardAttr,
            );

            return {
              attribute: {
                connect: {
                  id: (attributeIndex += 1),
                },
              },
            };
          }),
        },
      },
    });
  }

  console.log(chalk.green('seeded CARDS related tables ✔️'));
};

export default cardsSeeder;
