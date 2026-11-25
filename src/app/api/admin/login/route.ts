import { NextResponse } from 'next/server';
import { makeSession, ADMIN_COOKIE } from '@/lib/admin-auth';
export async function POST(req:Request){
  const {username,password}=await req.json();
  if(!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET)
    return NextResponse.json({error:'Admin credentials are not configured. Add the admin environment variables first.'},{status:503});
  if(username!==process.env.ADMIN_USERNAME || password!==process.env.ADMIN_PASSWORD)
    return NextResponse.json({error:'Incorrect username or password.'},{status:401});
  const res=NextResponse.json({ok:true});
  res.cookies.set(ADMIN_COOKIE,makeSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*12});
  return res;
}
