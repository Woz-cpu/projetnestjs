import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

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

async function main() {
    faker.setLocale('fr');
    await prisma.user.deleteMany();

    const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
        prisma.user.create({
        data: {
            username: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            roleId: 1,
            street: faker.location.street(),
            city: faker.location.city(),
            postalCode: faker.location.zipCode(),
            country: faker.location.country(),
        },
        })
    )
    );
    console.log('✅ Database seeded successfully');
}

main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
    })
    .finally(async () => {
    await prisma.$disconnect();
    });
