import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  console.log('[seed] Demarrage du seed...');

  // ============================================================
  // 0. NETTOYAGE (ordre inverse des dependances FK)
  //    -> rend le seed rejouable sans doublons ni conflits.
  // ============================================================
  console.log('[seed] Nettoyage des tables existantes...');

  await prisma.userLibrary.deleteMany();
  await prisma.gamePlatform.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  await prisma.publisher.deleteMany();
  await prisma.platform.deleteMany();
  await prisma.role.deleteMany();

  // ============================================================
  // 1. ROLES
  // ============================================================
  console.log('[seed] Creation des roles...');

  const [adminRole, userRole, moderatorRole] = await Promise.all([
    prisma.role.create({ data: { name: 'admin' } }),
    prisma.role.create({ data: { name: 'user' } }),
    prisma.role.create({ data: { name: 'moderator' } }),
  ]);

  console.log('  -> roles crees : admin, user, moderator');

  // ============================================================
  // 2. PLATFORMS
  // ============================================================
  console.log('[seed] Creation des plateformes...');

  const platformNames = ['PS5', 'Xbox', 'Switch', 'Switch 2', 'PC', 'Mac'];

  const platforms = await Promise.all(
    platformNames.map((name) =>
      prisma.platform.create({ data: { name } }),
    ),
  );

  console.log(`  -> ${platforms.length} plateformes creees`);

  // ============================================================
  // 3. PUBLISHERS
  // ============================================================
  console.log('[seed] Creation des publishers...');

  const publisherData = [
    { name: 'Nintendo', studioCreationDate: new Date('1889-09-23') },
    { name: 'Sony Interactive', studioCreationDate: new Date('1993-11-16') },
    { name: 'Microsoft Gaming', studioCreationDate: new Date('2000-01-01') },
    { name: 'Ubisoft', studioCreationDate: new Date('1986-03-28') },
    { name: 'EA Games', studioCreationDate: new Date('1982-05-28') },
    { name: 'Activision', studioCreationDate: new Date('1979-10-01') },
    { name: 'Rockstar Games', studioCreationDate: new Date('1998-12-01') },
    { name: 'CD Projekt Red', studioCreationDate: new Date('1994-05-01') },
    { name: 'Bethesda', studioCreationDate: new Date('1986-06-28') },
    { name: 'Square Enix', studioCreationDate: new Date('1975-09-22') },
  ];

  const publishers = await Promise.all(
    publisherData.map((p) => prisma.publisher.create({ data: p })),
  );

  console.log(`  -> ${publishers.length} publishers crees`);

  // ============================================================
  // 4. GAMES (+ relations GamePlatform)
  // ============================================================
  console.log('[seed] Creation des jeux...');

  const gameNames = [
    'The Legend of Zelda: Echoes of the Past',
    'Horizon Forbidden West II',
    'Halo Infinite 2',
    "Assassin's Creed Mirage 2",
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
    "Demon's Souls Remake 2",
    "Baldur's Gate 4",
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
          // Chaque jeu sort sur 1 a 4 plateformes aleatoires.
          platforms: {
            create: faker.helpers
              .arrayElements(platforms, { min: 1, max: 4 })
              .map((platform) => ({ platformId: platform.id })),
          },
        },
      });
    }),
  );

  console.log(`  -> ${games.length} jeux crees avec leurs plateformes`);

  // ============================================================
  // 5. USERS (+ UserLibrary)
  // ============================================================
  console.log('[seed] Creation des utilisateurs...');

  const hashedPassword = await bcrypt.hash('password', 10);

  // -- Admin fixe (identifiants connus pour se connecter)
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roleId: adminRole.id,
      street: '1 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      // L'admin possede aussi une librairie bien garnie.
      library: {
        create: faker.helpers
          .arrayElements(games, { min: 10, max: 20 })
          .map((game) => ({
            gameId: game.id,
            addedAt: faker.date.recent({ days: 365 }),
          })),
      },
    },
  });

  // -- 19 utilisateurs aleatoires (user / moderator)
  const randomRoles = [userRole, moderatorRole];
  const usedUsernames = new Set<string>(['admin']);
  const usedEmails = new Set<string>(['admin@example.com']);

  for (let i = 0; i < 19; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const role = randomRoles[i % randomRoles.length];

    // Garantit l'unicite de username/email malgre la generation aleatoire.
    let username = faker.internet.username({ firstName, lastName }).toLowerCase();
    while (usedUsernames.has(username)) {
      username = `${username}${faker.number.int({ min: 1, max: 999 })}`;
    }
    usedUsernames.add(username);

    let email = faker.internet.email({ firstName, lastName }).toLowerCase();
    while (usedEmails.has(email)) {
      email = faker.internet
        .email({ firstName, lastName, provider: `mail${i}.com` })
        .toLowerCase();
    }
    usedEmails.add(email);

    // Chaque user possede entre 3 et 15 jeux uniques dans sa librairie.
    const userGames = faker.helpers.arrayElements(games, { min: 3, max: 15 });

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId: role.id,
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        country: faker.location.country(),
        library: {
          create: userGames.map((game) => ({
            gameId: game.id,
            addedAt: faker.date.recent({ days: 365 }),
          })),
        },
      },
    });
  }

  const userCount = await prisma.user.count();
  const libraryCount = await prisma.userLibrary.count();
  const gamePlatformCount = await prisma.gamePlatform.count();

  console.log(`  -> ${userCount} utilisateurs crees avec leurs librairies`);

  // ============================================================
  // RESUME
  // ============================================================
  console.log('\n[seed] Termine avec succes !');
  console.log('Resume :');
  console.log(`   - ${await prisma.role.count()} roles`);
  console.log(`   - ${platforms.length} plateformes`);
  console.log(`   - ${publishers.length} publishers`);
  console.log(`   - ${games.length} jeux`);
  console.log(`   - ${gamePlatformCount} associations jeu/plateforme`);
  console.log(`   - ${userCount} utilisateurs (dont 1 admin)`);
  console.log(`   - ${libraryCount} entrees de librairie`);
  console.log('\nConnexion admin :');
  console.log('   Email    : admin@example.com');
  console.log('   Password : password');
}

main()
  .catch((e) => {
    console.error('[seed] Erreur :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
