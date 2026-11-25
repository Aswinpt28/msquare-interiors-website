import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Furniture } from '@/lib/models';
export const dynamic='force-dynamic';
export default async function FurniturePage(){
 let products:any[]=[];
 try { await connectDB(); products=await Furniture.find({active:true}).sort({createdAt:-1}).lean(); } catch {}
 return <main className="furniture-page"><section className="page-hero"><p className="eyebrow">M Square OBJECTS / FURNITURE</p><h1>Objects for<br/><em>living beautifully.</em></h1><p>A considered collection of furniture and pieces selected to bring comfort, character and intention into your space.</p></section>{products.length?<section className="furniture-grid">{products.map((p:any)=><article className="furniture-card" key={String(p._id)}><div className="furniture-image"><Image src={p.imageUrl} alt={p.title} fill unoptimized sizes="(max-width:700px) 100vw, 33vw"/></div><p className="eyebrow">{p.category||'M Square OBJECTS'}</p><h2>{p.title}</h2>{p.description&&<p>{p.description}</p>}{p.price!=null&&<strong>₹{Number(p.price).toLocaleString('en-IN')}</strong>}</article>)}</section>:<section className="furniture-coming"><span>01 / THE COLLECTION</span><h2>A new chapter<br/><em>is taking shape.</em></h2><p>Our furniture collection is in the making. For early enquiries and custom furniture requirements, speak with our studio.</p><a href="/contact">ENQUIRE WITH THE STUDIO ↗</a></section>}</main>
}
