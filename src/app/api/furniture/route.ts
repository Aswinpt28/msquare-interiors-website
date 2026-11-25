import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Furniture } from '@/lib/models';
export async function GET(){
 try { await connectDB(); const products=await Furniture.find({active:true}).sort({createdAt:-1}).lean(); return NextResponse.json({products}); }
 catch { return NextResponse.json({products:[]}); }
}
