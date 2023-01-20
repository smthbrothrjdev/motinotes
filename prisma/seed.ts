import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const smthbrothrj = await db.user.create({
    data: {
      username: 'smthbrothrj',
      // this is a hashed version of "twixrox"
      passwordHash:
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
    },
  });

  await Promise.all(
    getNotes().map((motiNote) => {
      const data = { motiUserId: smthbrothrj.id, ...motiNote };
      return db.motiNote.create({ data });
    })
  );
}

seed();

function getNotes() {
  return [
    {
      note: `Never trust a computer you can't throw out a window.`,
      name: `Steve Wozniak, co-founder of Apple Inc`,
    },

    {
      note: `The trouble with programmers is that you can never tell what a programmer is doing until it's too late.`,
      name: `Seymour Cray`,
    },

    {
      note: `Do, or do not. There is no try`,
      name: `Yoda`,
    },

    {
      note: `Computers are useless. They can only give you answers`,
      name: `Pablo Picasso`,
    },
  ];
}
