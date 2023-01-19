import { Outlet, Link } from '@remix-run/react';
import { LinksFunction } from '@remix-run/node';

import stylesUrl from '~/styles/motinote.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export default function MotiNotes() {
  return (
    <div className="motinote-layout">
      <header className="motinote-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix motinote"
              aria-label="Remix motinote"
            >
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
              <li>
                <Link to="some-joke-id">Hippo</Link>
              </li>
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
