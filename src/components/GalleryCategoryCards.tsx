import Link from 'next/link';

export type GalleryCategoryItem = {
  name: string;
  slug: string;
  count: number;
  image: string;
};

export default function GalleryCategoryCards({ categories }: { categories: GalleryCategoryItem[] }) {
  return <div className="gallery-category-cards">
    {categories.map((category, index) => <Link className="gallery-category-card" href={`/gallery/${category.slug}`} key={category.slug}>
      <span className="gallery-category-card-image">
        <img src={category.image} alt={`${category.name} interior`} loading={index > 3 ? 'lazy' : 'eager'} />
        <span className="gallery-category-card-count">{String(category.count).padStart(2, '0')} PHOTOGRAPHS</span>
        <span className="gallery-category-card-arrow">↗</span>
      </span>
      <span className="gallery-category-card-title"><span>{category.name}</span><span>EXPLORE COLLECTION</span></span>
    </Link>)}
  </div>;
}
