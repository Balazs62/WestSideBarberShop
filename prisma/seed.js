const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create default services
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'service-1' },
      update: {},
      create: {
        id: 'service-1',
        name: 'Hajvágás',
        description: 'Professzionális hajvágás és stílus',
        price: 5000,
        duration: 30,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-2' },
      update: {},
      create: {
        id: 'service-2',
        name: 'Szakálligazítás',
        description: 'Szakáll formázás és igazítás',
        price: 3000,
        duration: 20,
      },
    }),
    prisma.service.upsert({
      where: { id: 'service-3' },
      update: {},
      create: {
        id: 'service-3',
        name: 'Hajvágás + Szakáll',
        description: 'Teljes szolgáltatás csomag',
        price: 7000,
        duration: 45,
      },
    }),
  ]);

  console.log('Services created:', services);

  // Create default barber
  const barber = await prisma.barber.upsert({
    where: { id: 'barber-1' },
    update: {},
    create: {
      id: 'barber-1',
      name: 'WestSide Barber',
      email: 'barber@westsidebarbershop.hu',
      phone: '+36301234567',
      bio: 'Professzionális barber élmény',
    },
  });

  console.log('Barber created:', barber);

  // Create default schedule for barber (Monday to Friday, 9:00-17:00)
  const schedule = await Promise.all([
    prisma.schedule.upsert({
      where: { barberId_dayOfWeek: { barberId: 'barber-1', dayOfWeek: 1 } },
      update: {},
      create: {
        barberId: 'barber-1',
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
      },
    }),
    prisma.schedule.upsert({
      where: { barberId_dayOfWeek: { barberId: 'barber-1', dayOfWeek: 2 } },
      update: {},
      create: {
        barberId: 'barber-1',
        dayOfWeek: 2,
        startTime: '09:00',
        endTime: '17:00',
      },
    }),
    prisma.schedule.upsert({
      where: { barberId_dayOfWeek: { barberId: 'barber-1', dayOfWeek: 3 } },
      update: {},
      create: {
        barberId: 'barber-1',
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '17:00',
      },
    }),
    prisma.schedule.upsert({
      where: { barberId_dayOfWeek: { barberId: 'barber-1', dayOfWeek: 4 } },
      update: {},
      create: {
        barberId: 'barber-1',
        dayOfWeek: 4,
        startTime: '09:00',
        endTime: '17:00',
      },
    }),
    prisma.schedule.upsert({
      where: { barberId_dayOfWeek: { barberId: 'barber-1', dayOfWeek: 5 } },
      update: {},
      create: {
        barberId: 'barber-1',
        dayOfWeek: 5,
        startTime: '09:00',
        endTime: '17:00',
      },
    }),
  ]);

  console.log('Schedule created:', schedule);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
