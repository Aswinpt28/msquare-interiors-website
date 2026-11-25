import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'm2_admin_session';
function secret(){ return process.env.ADMIN_SESSION_SECRET || ''; }
function sign(value:string){ return createHmac('sha256',secret()).update(value).digest('hex'); }
export function makeSession(){
  if(!secret()) throw new Error('ADMIN_SESSION_SECRET is not configured');
  const payload = `${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}
export async function isAdmin(){
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if(!token || !secret()) return false;
  const [payload, signature] = token.split('.');
  if(!payload || !signature || Date.now()-Number(payload)> 1000*60*60*12) return false;
  const expected = sign(payload);
  try { return timingSafeEqual(Buffer.from(signature),Buffer.from(expected)); } catch { return false; }
}
export const ADMIN_COOKIE = COOKIE;
