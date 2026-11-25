import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { connectDB } from '@/lib/mongodb';
import { Media, Furniture } from '@/lib/models';
import { cloudinaryReady, deleteFromCloudinary } from '@/lib/cloudinary';
export async function GET(){
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try {
  await connectDB();
  const [photos,videos,products]=await Promise.all([
   Media.find({type:'photo'}).sort({createdAt:-1}).lean(),
   Media.find({type:'video'}).sort({createdAt:-1}).lean(),
   Media.find({type:'furniture'}).sort({createdAt:-1}).lean()
  ]);
  return NextResponse.json({photos,videos,products});
 } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Could not load media'},{status:503}); }
}

export async function DELETE(req:Request) {
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 try {
  await connectDB();
  const {id}=await req.json();
  const item=await Media.findById(id);
  if(!item) return NextResponse.json({error:'Media item not found'},{status:404});
  if(cloudinaryReady()) await deleteFromCloudinary(item.publicId,item.type==='video'?'video':'image');
  await Media.findByIdAndDelete(id);
  if(item.type==='furniture') await Furniture.deleteMany({publicId:item.publicId});
  return NextResponse.json({ok:true});
 } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Could not delete media'},{status:500}); }
}
