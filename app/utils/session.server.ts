import { db } from './db.server';
import bcrypt from 'bcryptjs';

type LoginDeets = {
  username: string;
  password: string;
};
export async function login({ username, password }: LoginDeets) {
  const user = await db.user.findFirst({ where: { username } });
  if (!user) return null;
  const isAuthenticated = await bcrypt.compare(password, user.passwordHash);

  if (!isAuthenticated) return null;

  return { id: user.id, username };
}
