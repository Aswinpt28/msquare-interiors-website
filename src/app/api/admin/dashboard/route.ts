import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Enquiry, Furniture, Media } from '@/lib/models';

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  try {
    await connectDB();
    const [photos,videos,products,enquiries,newEnquiries,recent] = await Promise.all([
      Media.countDocuments({type:'photo'}), Media.countDocuments({type:'video'}),
      Furniture.countDocuments({active:true}), Enquiry.countDocuments(),
      Enquiry.countDocuments({status:'New'}), Enquiry.find().sort({createdAt:-1}).limit(5).lean()
    ]);
    return NextResponse.json({stats:{photos,videos,products,enquiries,newEnquiries},recent});
  } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Database unavailable'},{status:503}); }
}
