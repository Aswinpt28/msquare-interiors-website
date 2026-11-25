import Image from "next/image";
import Link from "next/link";
const services = [
  [
    "01",
    "Residential interiors",
    "A cohesive design approach for homes that feel personal, comfortable and considered.",
    "/images/project-03.jpg",
  ],
  [
    "02",
    "Modular kitchens",
    "Beautifully planned kitchens with purposeful storage, durable finishes and an easy workflow.",
    "/images/project-01.webp",
  ],
  [
    "03",
    "Living & dining spaces",
    "Welcoming spaces that bring people together through thoughtful layouts and warm details.",
    "/images/project-16.jpg",
  ],
  [
    "04",
    "Bedrooms & wardrobes",
    "Restful private spaces with custom storage and a calm, balanced material palette.",
    "/images/project-17.jpg",
  ],
];
export default function Services() {
  return (
    <div className="inner-page">
      <section className="page-hero">
        <p className="eyebrow">M² / SERVICES</p>
        <h1>
          Considered design.
          <br />
          <em>Complete spaces.</em>
        </h1>
        <p>
          From the overall layout to the smallest finishing detail, we help
          bring your vision into focus.
        </p>
      </section>
      <section className="service-cards section-pad">
        {services.map(([n, t, d, img]) => (
          <article className="service-card" key={n}>
            <div className="service-card-image">
              <Image
                src={img}
                alt={t}
                fill
                sizes="(max-width: 700px) 100vw, 45vw"
              />
            </div>
            <div className="service-card-copy">
              <span className="eyebrow">{n} / SERVICE</span>
              <h2>{t}</h2>
              <p>{d}</p>
              <Link className="text-link" href="/contact">
                Discuss your project <span>↗</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
