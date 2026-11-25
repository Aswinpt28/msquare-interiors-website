import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Enquiry } from '@/lib/models';

export async function GET() {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const items=await Enquiry.find().sort({createdAt:-1}).lean(); return NextResponse.json({items}); }
 catch { return NextResponse.json({error:'Could not load enquiries'},{status:503}); }
}
export async function PATCH(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const {id,status}=await req.json(); if(!['New','Contacted','In Progress','Completed'].includes(status)) return NextResponse.json({error:'Invalid status'},{status:400}); const item=await Enquiry.findByIdAndUpdate(id,{status},{new:true}); if(!item)return NextResponse.json({error:'Enquiry not found'},{status:404}); return NextResponse.json({item}); }
 catch { return NextResponse.json({error:'Could not update enquiry'},{status:500}); }
}
export async function DELETE(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const {id}=await req.json(); await Enquiry.findByIdAndDelete(id); return NextResponse.json({ok:true}); }
 catch { return NextResponse.json({error:'Could not delete enquiry'},{status:500}); }
}
