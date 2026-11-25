import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { SiteSettings } from '@/lib/models';

export async function GET() {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const settings=await SiteSettings.findOne({key:'website'}).lean(); return NextResponse.json({settings:settings||{companyName:'M² Interiors',email:'hello@msquareinteriors.com',phone:'',address:'#203, V V Centre, Palarivattom, Cochin - 682025',instagram:'',whatsapp:'',homepageIntro:''}}); }
 catch { return NextResponse.json({error:'Could not load settings'},{status:503}); }
}
export async function PUT(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const body=await req.json(); const allowed=['companyName','email','phone','address','instagram','whatsapp','homepageIntro']; const update:any={}; for(const k of allowed) if(typeof body[k]==='string') update[k]=body[k].slice(0,2000); const settings=await SiteSettings.findOneAndUpdate({key:'website'},{$set:update,$setOnInsert:{key:'website'}},{new:true,upsert:true}); return NextResponse.json({settings}); }
 catch { return NextResponse.json({error:'Could not save settings'},{status:500}); }
}
