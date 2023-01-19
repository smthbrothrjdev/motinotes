import { Outlet, Link, useLoaderData } from '@remix-run/react';
import { LinksFunction, json } from '@remix-run/node';

import stylesUrl from '~/styles/motinote.css';
import { db } from '~/utils/db.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader = async () => {
  return json({
    motiNotes: await db.motiNote.findMany({
      take: 5,
      select: { id: true, note: true },
      orderBy: { createdAt: 'desc' },
    }),
  });
};

export default function MotiNotes() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="motinote-layout">
      <header className="motinote-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix motinote" aria-label="Remix motinote">
              <span className="logo">🤪</span>
              <span className="logo-medium">M🤪tiNotes!!</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="motinote-main">
        <div className="container">
          <div className="motinote-list">
            <Link to=".">Get a random motiNote</Link>
            <p>Here are a few more motinotes to check out:</p>
            <ul>
              {data.motiNotes.map((motiNote) => (
                <li key={motiNote.id}>
                  <Link to={motiNote.id}>
                    {motiNote.note.substring(0, 11).padEnd(14, '.')}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="motinote-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
