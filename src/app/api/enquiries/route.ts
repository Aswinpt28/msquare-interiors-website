import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Enquiry } from '@/lib/models';

export async function POST(req:Request) {
 try {
  const body=await req.json();
  const name=String(body.name||'').trim(), phone=String(body.phone||'').trim();
  if(!name || !phone) return NextResponse.json({error:'Name and phone number are required.'},{status:400});
  if(name.length>120 || phone.length>40) return NextResponse.json({error:'Please check the form details.'},{status:400});
  await connectDB();
  const item=await Enquiry.create({name,phone,email:String(body.email||'').slice(0,160),projectType:String(body.projectType||'Other').slice(0,100),message:String(body.message||'').slice(0,3000)});
  return NextResponse.json({ok:true,id:item._id},{status:201});
 } catch { return NextResponse.json({error:'Unable to submit enquiry right now. Please try again.'},{status:503}); }
}
