import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Furniture } from '@/lib/models';

export async function GET() {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); return NextResponse.json({items:await Furniture.find().sort({createdAt:-1}).lean()}); }
 catch { return NextResponse.json({error:'Could not load furniture'},{status:503}); }
}
export async function POST(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const body=await req.json(); const item=await Furniture.create({title:body.title,description:body.description||'',category:body.category||'Other furniture',price:body.price===''?null:Number(body.price),imageUrl:body.imageUrl,publicId:body.publicId,active:body.active!==false}); return NextResponse.json({item},{status:201}); }
 catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Could not create product'},{status:400}); }
}
export async function PATCH(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const {id,...body}=await req.json(); const allowed:any={}; for(const k of ['title','description','category','imageUrl','active']) if(body[k]!==undefined) allowed[k]=body[k]; if(body.price!==undefined) allowed.price=body.price===''?null:Number(body.price); const item=await Furniture.findByIdAndUpdate(id,allowed,{new:true,runValidators:true}); return NextResponse.json({item}); }
 catch { return NextResponse.json({error:'Could not update product'},{status:400}); }
}
export async function DELETE(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try { await connectDB(); const {id}=await req.json(); await Furniture.findByIdAndDelete(id); return NextResponse.json({ok:true}); }
 catch { return NextResponse.json({error:'Could not delete product'},{status:500}); }
}
