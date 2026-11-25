import GalleryCategoryCards, {
  GalleryCategoryItem,
} from "@/components/GalleryCategoryCards";
import { connectDB } from "@/lib/mongodb";
import { Media } from "@/lib/models";

type MediaResource = {
  asset_id: string;
  public_id: string;
  secure_url: string;
  format: string;
  title?: string;
  description?: string;
  category?: string;
  context?: { custom?: { caption?: string; alt?: string; category?: string } };
};

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Gallery | M² Interiors",
  description: "Explore interior collections by M² Interiors.",
};

const categoryDefinitions = [
  {
    name: "Living Room",
    slug: "living-room",
    cover:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    cover: "/images/High.webp",
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    cover:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Dining",
    slug: "dining",
    cover:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Bathroom",
    slug: "bathroom",
    cover:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Commercial",
    slug: "commercial",
    cover:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Other",
    slug: "other",
    cover:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  },
];

function normaliseCategory(value?: string) {
  const category = (value || "").trim().toLowerCase();
  if (category === "living" || category === "living room") return "Living Room";
  if (category === "kitchen") return "Kitchen";
  if (category === "bedroom") return "Bedroom";
  if (category === "dining") return "Dining";
  if (category === "bathroom") return "Bathroom";
  if (category === "commercial") return "Commercial";
  return "Other";
}

async function loadMedia() {
  try {
    await connectDB();
    const [photoDocs, videoDocs] = await Promise.all([
      Media.find({ type: "photo" }).sort({ createdAt: -1 }).lean(),
      Media.find({ type: "video" }).sort({ createdAt: -1 }).lean(),
    ]);
    const mapMedia = (item: any): MediaResource => ({
      asset_id: String(item._id),
      public_id: item.publicId,
      secure_url: item.url,
      format: item.format || "",
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      context: {
        custom: {
          caption: item.title || "",
          alt: item.description || "",
          category: item.category || "",
        },
      },
    });
    return { photos: photoDocs.map(mapMedia), videos: videoDocs.map(mapMedia) };
  } catch {
    return { photos: [] as MediaResource[], videos: [] as MediaResource[] };
  }
}

export default async function GalleryPage() {
  const { photos, videos } = await loadMedia();
  const categories: GalleryCategoryItem[] = categoryDefinitions
    .map((definition) => {
      const matching = photos.filter(
        (photo) =>
          normaliseCategory(
            photo.category || photo.context?.custom?.category,
          ) === definition.name,
      );
      return {
        name: definition.name,
        slug: definition.slug,
        count: matching.length,
        image: definition.cover,
      };
    })
    .filter((category) => category.count > 0 || category.name !== "Other");

  return (
    <main className="gallery-page">
      <section className="gallery-intro">
        <p className="world-kicker">
          M² INTERIORS&nbsp;&nbsp; / &nbsp;&nbsp; THE COLLECTION
        </p>
        <h1>
          Spaces, in
          <br />
          <em>every detail.</em>
        </h1>
        <p>
          Explore our work by room. Choose a collection to discover the details,
          materials and ideas behind each space.
        </p>
        <div className="gallery-counts">
          <span>{photos.length.toString().padStart(2, "0")} PHOTOGRAPHS</span>
          <i />
          <span>{videos.length.toString().padStart(2, "0")} FILMS</span>
        </div>
      </section>

      {categories.length > 0 ? (
        <section className="gallery-section gallery-category-landing">
          <div className="gallery-section-heading">
            <div>
              <p className="world-kicker">01 / EXPLORE BY SPACE</p>
              <h2>
                Choose a <em>collection.</em>
              </h2>
            </div>
          </div>
          <GalleryCategoryCards categories={categories} />
        </section>
      ) : (
        <section className="gallery-empty">
          <span className="world-kicker">THE COLLECTION IS TAKING SHAPE</span>
          <h2>
            Beautiful spaces
            <br />
            <em>are worth sharing.</em>
          </h2>
          <p>
            Our latest photographs will appear here as they are added to the
            studio collection.
          </p>
        </section>
      )}

      {videos.length > 0 && (
        <section className="gallery-section gallery-video-section">
          <div className="gallery-section-heading">
            <div>
              <p className="world-kicker">02 / THE FILMS</p>
              <h2>
                Experience the <em>space.</em>
              </h2>
            </div>
          </div>
          <div className="gallery-video-grid">
            {videos.map((video) => (
              <figure key={video.asset_id || video.public_id}>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  src={video.secure_url}
                />
                <figcaption className="gallery-film-caption">
                  <div>
                    <span>
                      {video.title ||
                        video.context?.custom?.caption ||
                        "M² INTERIORS FILM"}
                    </span>
                    {(video.description || video.context?.custom?.alt) && (
                      <p>{video.description || video.context?.custom?.alt}</p>
                    )}
                  </div>
                  <span>PLAY FILM ↗</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
