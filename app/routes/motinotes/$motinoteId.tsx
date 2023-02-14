import { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { json, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { db } from '~/utils/db.server';

export const loader = async ({ params }: LoaderArgs) => {
  const motiNote = await db.motiNote.findUnique({
    where: { id: params.motinoteId },
  });

  if (!motiNote) {
    throw new Error('No motinote found!');
  }

  return json({ motiNote });
};

export default function MotiNoteRoute() {
  const data = useLoaderData<typeof loader>();
  const name = data.motiNote.name;
  return (
    <div>
      <p>
        {data.motiNote.note}
        <span>{'  - ' + name}</span>
      </p>
      <Link to="."> This {data.motiNote.name} quote permalink! </Link>
    </div>
  );
}

export function ErrorBoundary() {
  const { motinoteId } = useParams();
  return (
    <div className="error-container">{`There was an error loading joke by the id ${motinoteId}. Sorry.`}</div>
  );
}
