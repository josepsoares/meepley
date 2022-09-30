import chalk from 'chalk';
import prisma from '../../../src/clients/prisma';

const PlaceTypes = [
  {
    name: 'Café',
    emoji: '☕',
  },
  { name: 'Indoors', emoji: '🏬' },
  { name: 'Zona Comercial', emoji: '🛒' },
  { name: 'Parque', emoji: '🏞️' },
  { name: 'Ar Livre', emoji: '🌤️' },
  { name: 'Restaurante', emoji: '🍴' },
  { name: 'Biblioteca', emoji: '📚' },
  { name: 'Bar', emoji: '🍸' },
];

const Places = [
  {
    name: 'Avenida Café-Concerto',
    address: 'Praça do Mercado nº1, 3800-224 Aveiro',
    latitude: 40.64239282703135,
    longitude: -8.649612359409039,
    hours_open: '17:00-02:00',
    minimum_consumption: 1.5,
    image:
      'https://imagens.publico.pt/imagens.aspx/1387318?tp=UH&db=IMAGENS&type=JPG',
    open_days: [
      'Segunda-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Café'),
      PlaceTypes.find((item) => item.name === 'Bar'),
      PlaceTypes.find((item) => item.name === 'Indoors'),
    ],
  },
  {
    name: 'Universidade de Aveiro',
    address: 'Universidade de Aveiro, 3810-193 Aveiro',
    latitude: 40.630537815536385,
    longitude: -8.65750746319497,
    hours_open: '09:00-18:00',
    image: 'https://api-assets.ua.pt/files/imgs/000/000/048/original.jpg',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [PlaceTypes.find((item) => item.name === 'Ar Livre')],
  },
  {
    name: 'Convívio',
    address: 'R. de Aires Barbosa 11, 3810-049 Aveiro',
    latitude: 40.63405795547598,
    longitude: -8.648266475764512,
    hours_open: '09:00-02:00',
    minimum_consumption: 1.5,
    image:
      'https://www.evasoes.pt/files/2019/01/33370087_BINARY_GL23122018_MARIAJOAOGALA17_resultado-960x640_c.jpg',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Café'),
      PlaceTypes.find((item) => item.name === 'Bar'),
      PlaceTypes.find((item) => item.name === 'Indoors'),
    ],
  },
  {
    name: 'Fórum de Aveiro',
    address: 'R. do Batalhão de Caçadores 10, 3810-064 Aveiro',
    latitude: 40.640994722057314,
    longitude: -8.651877533113431,
    hours_open: '09:00-23:00',
    image:
      'https://forumaveiro.com/wp-content/uploads/2019/04/forum_default_banner.jpg',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Zona Comercial'),
      PlaceTypes.find((item) => item.name === 'Ar Livre'),
    ],
  },
  {
    name: 'Parque da Macaca',
    address: 'Parque Infante D. Pedro (da Macaca), 3810-169 Aveiro',
    latitude: 40.636392,
    longitude: -8.652929,
    hours_open: '24:00',
    image:
      'https://media-cdn.tripadvisor.com/media/photo-s/17/13/61/05/un-endroit-paisible-loin.jpg',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Parque'),
      PlaceTypes.find((item) => item.name === 'Ar Livre'),
    ],
  },
  {
    name: 'Glicínias Plaza Shopping Center',
    address: 'R. Dom Manuel Barbuda e Vasconcelos, 3810-498 Aveiro',
    latitude: 40.6269515,
    longitude: -8.648227,
    hours_open: '08:00 às 00:30',
    image:
      'https://scontent.fopo4-1.fna.fbcdn.net/v/t39.30808-6/277462914_5287088748002459_5833215178009480996_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=730e14&_nc_ohc=rTmY-KOVR4wAX_c2Pp_&_nc_oc=AQnLKvyEodRg9P42kdnIkF9R8FnMwXBxMNhHvKpHB06tZmy9VPGDoejNZbhmHGfwLbjhGNjdTsH3Rq2gP3BM65gU&tn=sDj-4jKcXpHKihuR&_nc_ht=scontent.fopo4-1.fna&oh=00_AT8eCUrwx3yaO_13ijBWi9awKAE2cHqRKN63LWDTYLztZQ&oe=62DD7EA4',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Indoors'),
      PlaceTypes.find((item) => item.name === 'Zona Comercial'),
    ],
  },
  {
    name: 'Mercado Manuel Firmino',
    address: 'Praça do Mercado 82, 3800-223 Aveiro',
    latitude: 40.6269515,
    longitude: -8.648227,
    hours_open: '07:00 às 19:00',
    image:
      'https://www.cm-aveiro.pt/cmaveiro/uploads/poi/image/39/mercado_manuel_firmino_2.JPG',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Indoors'),
      PlaceTypes.find((item) => item.name === 'Zona Comercial'),
    ],
  },
  {
    name: 'Jardim do Rossio',
    address: 'Largo do Rossio, 3800-198 Aveiro',
    latitude: 40.6411817,
    longitude: -8.654909,
    hours_open: '24:00',
    image:
      'https://www.cm-aveiro.pt/thumbs/cmaveiro/uploads/content_image/image/358/fotomontagem_b_263_04_1_1024_2500.jpg',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Parque'),
      PlaceTypes.find((item) => item.name === 'Ar Livre'),
    ],
  },
  {
    name: 'Parque de Santo António',
    address: 'R. Homem Cristo Filho 4, 3810-100 Aveiro',
    latitude: 40.6397676,
    longitude: -8.6546884,
    hours_open: '24:00',
    image:
      'https://granderota.riadeaveiro.pt/media/images/_FMR8157-min.original.jpg',
    open_days: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
      'Domingo',
    ],
    types: [
      PlaceTypes.find((item) => item.name === 'Parque'),
      PlaceTypes.find((item) => item.name === 'Ar Livre'),
    ],
  },
];

const placesSeeder = async () => {
  console.log(chalk.yellow('starting seeding places... 🌱 🗺️'));

  //* seeding place types
  await prisma.placeType.createMany({
    data: PlaceTypes,
  });

  //* seed the actual places
  for await (const place of Places) {
    await prisma.place.create({
      data: {
        name: place.name,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        hours_open: place.hours_open,
        minimum_consumption: place?.minimum_consumption || null,
        image: place.image,
        open_days: place.open_days,
        types: {
          create: place.types.map((placeType) => {
            //* get place type index to connect with the id in the existing table
            let typeIndex = PlaceTypes.findIndex(
              (item) => item.name === placeType.name,
            );

            return {
              type: {
                connect: {
                  id: (typeIndex += 1),
                },
              },
            };
          }),
        },
      },
    });
  }

  console.log(chalk.green('seeded PLACES related tables ✔️'));
};

export default placesSeeder;
