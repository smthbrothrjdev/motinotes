import { db } from './db.server';
import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

type LoginDeets = {
  username: string;
  password: string;
};

const sessionSecretz = process.env.SESSION_SECRET;
if (!sessionSecretz) {
  throw Error(
    'UH OH!! No session secret (SESSION_SECRET) found in environment!'
  );
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'motiNote_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecretz],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
    httpOnly: true,
  },
});

export async function login({ username, password }: LoginDeets) {
  const user = await db.user.findFirst({ where: { username } });
  if (!user) return null;
  const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

  if (!isAuthenticated) return null;

  return { id: user.id, username };
}

export async function createUserSession(userId: string, route: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(route, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}
