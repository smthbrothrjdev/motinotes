import { json } from '@remix-run/node';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const count = await db.motiNote.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [motiNote] = await db.motiNote.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!motiNote){
    throw new Response("Cant find a random motiNote. Sorry!", {status:404})
  }
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
export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected happened. Trained monkeys will be sent to handle the
      issue.
    </div>
  );
}
export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        There are no motiNotes to display.
      </div>
    );
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status}`
  );
}
