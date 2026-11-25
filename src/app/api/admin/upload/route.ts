import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { cloudinaryReady, uploadToCloudinary } from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import { Furniture, Media } from '@/lib/models';

export const runtime='nodejs';
export async function POST(req:Request){
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!cloudinaryReady()) return NextResponse.json({error:'Configure Cloudinary credentials to enable uploads.'},{status:503});
 try{
  const form=await req.formData(); const file=form.get('file');
  if(!file || typeof file==='string') return NextResponse.json({error:'Choose a file to upload.'},{status:400});
  const kind=String(form.get('kind')||'photo');
  if(!['photo','video','furniture'].includes(kind)) return NextResponse.json({error:'Invalid content type.'},{status:400});
  if(file.size>100*1024*1024) return NextResponse.json({error:'Maximum file size is 100 MB.'},{status:413});
  if(kind==='video'&&!file.type.startsWith('video/')) return NextResponse.json({error:`The selected file is not recognised as a video (received: ${file.type || 'unknown file type'}). Please choose an MP4, MOV or WebM video.`},{status:400});
  if(kind!=='video'&&!file.type.startsWith('image/')) return NextResponse.json({error:'Please select an image file.'},{status:400});
  const title=String(form.get('title')||'').trim(), description=String(form.get('description')||'');
  const category=String(form.get('category')||'Furniture'), price=String(form.get('price')||'');
  if(!title) return NextResponse.json({error:'A title is required.'},{status:400});
  const result=await uploadToCloudinary(file,kind,{title,description,price,category});
  await connectDB();
  const mediaType=kind==='furniture'?'furniture':kind;
  await Media.create({publicId:result.public_id,url:result.secure_url,type:mediaType,title,description,category,price:price?Number(price):null,format:result.format});
  let product=null;
  if(kind==='furniture') product=await Furniture.create({title,description,category,price:price?Number(price):null,imageUrl:result.secure_url,publicId:result.public_id,active:true});
  return NextResponse.json({ok:true,asset:{url:result.secure_url,publicId:result.public_id,format:result.format},product});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Upload failed'},{status:500});}
}
