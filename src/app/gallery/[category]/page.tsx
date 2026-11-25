import Link from 'next/link';
import { notFound } from 'next/navigation';
import GalleryPhotoGrid from '@/components/GalleryPhotoGrid';
import { connectDB } from '@/lib/mongodb';
import { Media } from '@/lib/models';

type MediaResource = { asset_id: string; public_id: string; secure_url: string; context?: { custom?: { caption?: string; alt?: string; category?: string } } };
const categories = [
  { name: 'Living Room', slug: 'living-room' }, { name: 'Kitchen', slug: 'kitchen' },
  { name: 'Bedroom', slug: 'bedroom' }, { name: 'Dining', slug: 'dining' },
  { name: 'Bathroom', slug: 'bathroom' }, { name: 'Commercial', slug: 'commercial' }, { name: 'Other', slug: 'other' },
];
function normaliseCategory(value?: string) {
  const category = (value || '').trim().toLowerCase();
  if (category === 'living' || category === 'living room') return 'Living Room';
  if (category === 'kitchen') return 'Kitchen'; if (category === 'bedroom') return 'Bedroom';
  if (category === 'dining') return 'Dining'; if (category === 'bathroom') return 'Bathroom';
  if (category === 'commercial') return 'Commercial'; return 'Other';
}
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params; const item = categories.find((entry) => entry.slug === slug);
  return { title: item ? `${item.name} Interiors | M Square Interiors` : 'Gallery | M Square Interiors', description: item ? `Explore our ${item.name.toLowerCase()} interior design photographs.` : 'Explore M Square Interiors projects.' };
}
export default async function GalleryCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params; const category = categories.find((entry) => entry.slug === slug);
  if (!category) notFound();
  let photos: MediaResource[] = [];
  try { await connectDB(); const docs = await Media.find({ type: 'photo' }).sort({ createdAt: -1 }).lean(); photos = docs.filter((item: any) => normaliseCategory(item.category) === category.name).map((item: any) => ({ asset_id: String(item._id), public_id: item.publicId, secure_url: item.url, context: { custom: { caption: item.title || '', alt: item.description || '', category: item.category || '' } } })); } catch { photos = []; }
  return <main className="gallery-page gallery-category-page">
    <section className="gallery-intro gallery-category-intro">
      <Link href="/gallery" className="gallery-back-link">← BACK TO ALL COLLECTIONS</Link>
      <p className="world-kicker">M Square INTERIORS&nbsp;&nbsp; / &nbsp;&nbsp; THE COLLECTION</p>
      <h1>{category.name.split(' ').map((word, index) => index === 0 ? word : <><br/><em key={word}>{word}</em></>)}</h1>
      <p>A closer look at our {category.name.toLowerCase()} interiors, thoughtfully designed down to the final detail.</p>
      <div className="gallery-counts"><span>{photos.length.toString().padStart(2, '0')} PHOTOGRAPHS</span></div>
    </section>
    <section className="gallery-section">
      <div className="gallery-section-heading"><div><p className="world-kicker">01 / {category.name.toUpperCase()}</p><h2>The <em>collection.</em></h2></div><Link href="/gallery" className="gallery-back-inline">ALL COLLECTIONS ↗</Link></div>
      {photos.length ? <GalleryPhotoGrid photos={photos} /> : <div className="gallery-empty gallery-category-empty"><span className="world-kicker">MORE TO COME</span><h2>This collection is<br/><em>taking shape.</em></h2><p>New {category.name.toLowerCase()} photographs will appear here as they are added to the studio collection.</p></div>}
    </section>
  </main>;
}
