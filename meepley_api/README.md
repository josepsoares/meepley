# MeePley Node.js CRUD RESTful API (Express / TypeScript / Prisma)

[![TypeScript][typescript-badge]][typescript-url] [![Yarn][yarn-badge]][yarn-url] [![Postgres][postgres-badge]][postgres-url] [![NodeJs][node-js-badge]][node-js-url] [![Express][express-badge]][express-url] [![Prisma][prisma-badge]][prisma-url] [![JWT][jwt-badge]][jwt-url] [![Pug][pug-badge]][pug-url] [![Swagger][swagger-badge]][swagger-url] [![ESLint][eslint-badge]][eslint-url] [![prettier][prettier-badge]][prettier-url]

## Requirements/Installation

- [Node v16+][node-js-url]
- [PostgreSQL][postgres-url]
- [Yarn][yarn-url]

```bash
$ sudo apt update && sudo apt upgrade -y

$ cd ~
$ curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
$ sudo apt-get install nodejs
$ node -v

$ sudo apt install postgresql postgresql-contrib
$ sudo -u postgres psql -c "SELECT version();"
$ sudo su - postgres -c "createuser *"
$ sudo su - postgres -c "createdb *"
$ sudo -u postgres psql
postgres=# GRANT ALL PRIVILEGES ON DATABASE * TO *;

$ git clone *insert the correct url here*

# everything should be good to go
```

## Running

_Easily set up a local development environment with some commands_

```bash
# firstly install dependecies
$ yarn install

# push schema to db
$ npx prisma db push

# seed the db
$ npx prisma db seed

# then you can start the app, can also start in dev mode
$ yarn start
$ yarn dev

# to create a build
$ yarn build
```

## Features

- [Express][express-url] framework
- [TypeScript v4][typescript-url]
- [Prisma][prisma-url]
- CRUD API design
- MVC design
- Authentication with credentials and providers via JWTs (todo)
- Using [puppeteer](https://github.com/puppeteer/puppeteer) to get boardgames from [BGG](https://boardgamegeek.com)
- HTML templates with [Pug][pug-url]
- Mailing with [node-mailer](https://nodemailer.com/about/)
- Logging with [winston](https://www.npmjs.com/package/winston) and [morgan](https://www.npmjs.com/package/morgan)
- Linting with [ESLint][eslint-url]
- [Prettier][prettier-url] code formatter
- Git hooks with [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged) (will be implemented later)

## Authors

- Gonçalo Fidalgo
- [José Soares](https://josepsoares.vercel.app/)
- Mariana Gomes

## Social Media

![Facebook][facebook-badge]
![Instagram][instagram-badge]
![Twitter][twitter-badge]

[comment]: <> (Badges)
[typescript-badge]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[yarn-badge]: https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white
[postgres-badge]: https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[node-js-badge]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[express-badge]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[prisma-badge]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[jwt-badge]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[pug-badge]: https://img.shields.io/badge/Pug-FFF?style=for-the-badge&logo=pug&logoColor=A86454
[swagger-badge]: https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white
[eslint-badge]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[prettier-badge]: https://img.shields.io/badge/code_style-prettier-18ffff.svg?style=for-the-badge&labelColor=grey

[comment]: <> (Urls)
[typescript-url]: https://github.com/microsoft/TypeScript
[yarn-url]: https://yarnpkg.com
[postgres-url]: https://www.postgresql.org
[node-js-url]: https://nodejs.org/
[express-url]: https://github.com/expressjs/express
[prisma-url]: https://www.prisma.io
[jwt-url]: https://jwt.io
[pug-url]: https://pugjs.org/api/getting-started.html
[swagger-url]: https://swagger.io
[eslint-url]: https://eslint.org
[prettier-url]: https://github.com/prettier/prettier

[comment]: <> (Social Stuff)
[facebook-badge]: https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white
[facebook-url]: https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white
[instagram-badge]: https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white
[instagram-url]: https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white
[twitter-badge]: https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white
[twitter-url]: https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white
