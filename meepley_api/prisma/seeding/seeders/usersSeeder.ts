import argon2 from 'argon2';
import chalk from 'chalk';
import { Role } from '@prisma/client';
import prisma from '../../../src/clients/prisma';

const usersSeeder = async () => {
  console.log(chalk.yellow('generating users... 😏 🐶 👩 🐱 🦄'));

  const users = [
    {
      name: 'John Doe',
      username: '@john_doe',
      email: 'teste@gmail.com',
      password: await argon2.hash('secretjohndoe'),
      avatar:
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      places_id: null,
      boardgame_skills_id: 1,
      role: Role.ADMIN,
      calibrated: undefined,
      achievements: {
        create: { achievement: { connect: { id: 1 } } },
      },
      cards: {
        create: { card: { connect: { id: 1 } } },
      },
    },
    {
      name: 'Peter Doe',
      username: '@peter_doe',
      email: 'teste_peter@gmail.com',
      password: await argon2.hash('secretpeterdoe'),
      avatar: 'avatar-2.png',
      places_id: 1,
      boardgame_skills_id: 2,
      calibrated: undefined,
    },
    {
      name: 'Rachel Doe',
      username: '@rachel_doe',
      email: 'teste_rachel@gmail.com',
      password: await argon2.hash('secretracheldoe'),
      avatar:
        'https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      boardgame_skills_id: 2,
      calibrated: undefined,
    },
    {
      name: 'Mary Doe',
      username: '@mary_doe',
      email: 'teste_mary@gmail.com',
      password: await argon2.hash('secretmarydoe'),
      avatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      boardgame_skills_id: 2,
      calibrated: undefined,
      achievements: {
        create: [
          { achievement: { connect: { id: 1 } } },
          { achievement: { connect: { id: 2 } } },
          { achievement: { connect: { id: 3 } } },
          { achievement: { connect: { id: 4 } } },
          { achievement: { connect: { id: 5 } } },
        ],
      },
      cards: {
        create: [
          { card: { connect: { id: 1 } } },
          { card: { connect: { id: 2 } } },
          { card: { connect: { id: 3 } } },
          { card: { connect: { id: 4 } } },
          { card: { connect: { id: 5 } } },
        ],
      },
    },
    {
      name: 'Jessica Doe',
      username: '@jessica_doe',
      email: 'teste_jessica@gmail.com',
      password: await argon2.hash('secretjessicadoe'),
      avatar:
        'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=689&q=80',
      boardgame_skills_id: 2,
      calibrated: undefined,
      achievements: {
        create: { achievement: { connect: { id: 5 } } },
      },
      cards: {
        create: { card: { connect: { id: 7 } } },
      },
    },
  ];

  console.log(chalk.yellow('starting seeding users... 🌱'));

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(chalk.green('seeded USERS related tables ✔️'));
};

export default usersSeeder;
