import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const count = await db.motiNote.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [motiNote] = await db.motiNote.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  return json({ motiNote });
};

export default function MotiNotesIndexRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>Here's a random motiNote!:</p>
      <p>{data.motiNote.note}</p>
      <Link to={data.motiNote.id}>
        This "{data.motiNote.name}" quote Permalink
      </Link>
    </div>
  );
}
