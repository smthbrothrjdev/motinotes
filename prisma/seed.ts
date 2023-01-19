import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getNotes().map((motiNote) => {
      return db.motiNote.create({ data: motiNote });
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
