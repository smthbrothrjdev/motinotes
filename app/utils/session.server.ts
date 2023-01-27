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
    secure: true,
    //secure: process.env.NODE_ENV === 'production',
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

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
