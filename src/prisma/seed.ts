import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log(':pousse: Début du seed...');

  // ============================================================
  // 1. ROLES
  // ============================================================
  console.log(':buste_silhouette: Création des rôles...');

  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' },
    }),
    prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user' },
    }),
    prisma.role.upsert({
      where: { name: 'moderator' },
      update: {},
      create: { name: 'moderator' },
    }),
  ]);

  const adminRole      = roles[0];
  const userRole       = roles[1];
  const moderatorRole  = roles[2];

  console.log(':coche_blanche: Rôles créés : admin, user, moderator');

  // ============================================================
  // 2. PLATFORMS
  // ============================================================
  console.log(':jeu_vidéo: Création des plateformes...');

  const platformNames = ['PS5', 'Xbox', 'Switch', 'Switch 2', 'PC', 'Mac'];

  const platforms = await Promise.all(
    platformNames.map((name) =>
      prisma.platform.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  console.log(`:coche_blanche: ${platforms.length} plateformes créées`);

  // ============================================================
  // 3. PUBLISHERS
  // ============================================================
  console.log(':bureaux: Création des publishers...');

  const publisherData = [
    { name: 'Nintendo',           studioCreationDate: new Date('1889-09-23') },
    { name: 'Sony Interactive',   studioCreationDate: new Date('1993-11-16') },
    { name: 'Microsoft Gaming',   studioCreationDate: new Date('2000-01-01') },
    { name: 'Ubisoft',            studioCreationDate: new Date('1986-03-28') },
    { name: 'EA Games',           studioCreationDate: new Date('1982-05-28') },
    { name: 'Activision',         studioCreationDate: new Date('1979-10-01') },
    { name: 'Rockstar Games',     studioCreationDate: new Date('1998-12-01') },
    { name: 'CD Projekt Red',     studioCreationDate: new Date('1994-05-01') },
    { name: 'Bethesda',           studioCreationDate: new Date('1986-06-28') },
    { name: 'Square Enix',        studioCreationDate: new Date('1975-09-22') },
  ];

  const publishers = await Promise.all(
    publisherData.map((p) =>
      prisma.publisher.upsert({
        where: { name: p.name },
        update: {},
        create: p,
      })
    )
  );

  console.log(`:coche_blanche: ${publishers.length} publishers créés`);

  // ============================================================
  // 4. GAMES (50 jeux)
  // ============================================================
  console.log(':joystick:  Création des jeux...');

  const gameNames = [
    'The Legend of Zelda: Echoes of the Past',
    'Horizon Forbidden West II',
    'Halo Infinite 2',
    'Assassin\'s Creed Mirage 2',
    'FIFA 26',
    'Call of Duty: Black Ops VII',
    'Red Dead Redemption 3',
    'The Witcher 4',
    'The Elder Scrolls VI',
    'Final Fantasy XVII',
    'Mario Kart 10',
    'God of War: Ragnarok II',
    'Spider-Man 3',
    'Cyberpunk 2078',
    'Elden Ring 2',
    'Forza Horizon 6',
    'Gran Turismo 8',
    'Pokemon Legends Z',
    'Metroid Prime 4',
    'Splatoon 4',
    'Starfield 2',
    'Diablo V',
    'Overwatch 3',
    'Street Fighter VII',
    'Tekken 9',
    'Mortal Kombat 13',
    'Resident Evil 10',
    'Devil May Cry 6',
    'Monster Hunter Wilds 2',
    'Dark Souls IV',
    'Bloodborne 2',
    'Death Stranding 3',
    'Ghost of Tsushima 2',
    'Last of Us Part IV',
    'Uncharted 5',
    'Demon\'s Souls Remake 2',
    'Baldur\'s Gate 4',
    'Divinity Original Sin 3',
    'Mass Effect 5',
    'Dragon Age: The Veilguard 2',
    'Hollow Knight: Silksong 2',
    'Celeste 2',
    'Stardew Valley 2',
    'Animal Crossing: New Horizons 2',
    'Super Smash Bros. Ultimate 2',
    'Kirby and the Forgotten Land 2',
    'Donkey Kong Bananza 2',
    'Bayonetta 4',
    'Xenoblade Chronicles 4',
    'Fire Emblem: Engage 2',
  ];

  const games = await Promise.all(
    gameNames.map((name, index) => {
      const publisher = publishers[index % publishers.length];

      return prisma.game.create({
        data: {
          name,
          releaseDate: faker.date.between({
            from: new Date('2020-01-01'),
            to: new Date('2026-12-31'),
          }),
          publisherId: publisher.id,
          // Relations GamePlatform : entre 1 et 4 plateformes aléatoires par jeu
          platforms: {
            create: faker.helpers
              .arrayElements(platforms, { min: 1, max: 4 })
              .map((platform) => ({
                platformId: platform.id,
              })),
          },
        },
      });
    })
  );

  console.log(`:coche_blanche: ${games.length} jeux créés avec leurs plateformes`);

  // ============================================================
  // 5. USERS (10 users, le 1er est admin)
  // ============================================================
  console.log(':bustes_silhouettes: Création des utilisateurs...');

  const hashedPassword = await bcrypt.hash('password', 10);

  // -- Admin fixe
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username:  'admin',
      email:     'admin@example.com',
      password:  hashedPassword,
      firstName: 'Super',
      lastName:  'Admin',
      roleId:    adminRole.id,
      street:    '1 Rue de la Paix',
      city:      'Paris',
      postalCode:'75001',
      country:   'France',
    },
  });

  // -- 9 users aléatoires
  const randomRoles = [userRole, moderatorRole];

  for (let i = 0; i < 9; i++) {
    const firstName = faker.person.firstName();
    const lastName  = faker.person.lastName();
    const role      = randomRoles[i % randomRoles.length];

    const user = await prisma.user.create({
      data: {
        username:  faker.internet.username({ firstName, lastName }).toLowerCase(),
        email:     faker.internet.email({ firstName, lastName }).toLowerCase(),
        password:  hashedPassword,
        firstName,
        lastName,
        roleId:    role.id,
        street:    faker.location.streetAddress(),
        city:      faker.location.city(),
        postalCode:faker.location.zipCode(),
        country:   faker.location.country(),
      },
    });

    // Chaque user a entre 3 et 15 jeux dans sa librairie
    const userGames = faker.helpers.arrayElements(games, {
      min: 3,
      max: 15,
    });

    await Promise.all(
      userGames.map((game) =>
        prisma.userLibrary.create({
          data: {
            userId:  user.id,
            gameId:  game.id,
            addedAt: faker.date.recent({ days: 365 }),
          },
        })
      )
    );
  }

  console.log(':coche_blanche: 10 utilisateurs créés avec leurs librairies');

  // ============================================================
  // RÉSUMÉ
  // ============================================================
  console.log('\n:tada: Seed terminé avec succès !');
  console.log(':histogramme: Résumé :');
  console.log(`   - ${roles.length} rôles`);
  console.log(`   - ${platforms.length} plateformes`);
  console.log(`   - ${publishers.length} publishers`);
  console.log(`   - ${games.length} jeux`);
  console.log('   - 10 utilisateurs (dont 1 admin)');
  console.log('\n:clé: Connexion admin :');
  console.log('   Email    : admin@example.com');
  console.log('   Password : password');
}

main()
  .catch((e) => {
    console.error(':x: Erreur seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });