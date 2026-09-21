import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User" CASCADE;`);

  const user = await prisma.user.create({
    data: {
      email: 'alex@spotifyclone.local',
      displayName: 'Alex Rivers',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      artistProfile: {
        create: {
          bio: 'Electronic & Synthwave producer based in Seattle.',
          bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200',
          verified: true,
        },
      },
    },
    include: { artistProfile: true },
  });

  const artistId = user.artistProfile!.id;

  const album = await prisma.album.create({
    data: {
      title: 'Neon Odyssey',
      coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
      releaseDate: new Date('2024-01-15'),
      artistId,
      tracks: {
        create: [
          {
            title: 'Midnight Drive',
            durationSec: 215,
            audioKey: 'demo-midnight-drive.mp3',
            artistId,
          },
          {
            title: 'Cyber Horizons',
            durationSec: 184,
            audioKey: 'demo-cyber-horizons.mp3',
            artistId,
          },
        ],
      },
    },
    include: { tracks: true },
  });

  await prisma.playlist.create({
    data: {
      title: 'Synth & Chill',
      description: 'The definitive retro-futuristic audio journey.',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
      ownerId: user.id,
      tracks: {
        create: [
          { trackId: album.tracks[0].id, position: 0 },
          { trackId: album.tracks[1].id, position: 1 },
        ],
      },
    },
  });

  console.log('Database successfully seeded.');
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());