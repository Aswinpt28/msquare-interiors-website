import Image from 'next/image';
import Link from 'next/link';

const services = [
  ['01', 'Complete home interiors', 'A cohesive design language for every room, surface and detail.'],
  ['02', 'Modular kitchens', 'Beautifully planned kitchens with considered storage and finishes.'],
  ['03', 'Living & dining spaces', 'Warm, expressive spaces designed around the way you gather.'],
  ['04', 'Bedrooms & wardrobes', 'Personal retreats with custom furniture and intelligent storage.'],
];

export default function Home() {
  return <>
    <section className="world-hero">
      <video className="world-hero-video" autoPlay muted loop playsInline preload="auto" poster="/images/hero-film-poster.jpg" aria-label="M² Interiors residential design film">
        <source src="/videos/project-film-2.mp4" type="video/mp4" />
      </video>
      <div className="world-hero-overlay" />
      <div className="world-hero-content">
        <p className="world-eyebrow">M² INTERIORS&nbsp;&nbsp; / &nbsp;&nbsp; SPACES THAT INSPIRE</p>
        <h1>Interiors<br/>with <em>intention.</em></h1>
        {/* <div className="world-hero-bottom"><p>We shape considered spaces<br/>for the way you live.</p><Link href="#services" className="world-round-link">EXPLORE<br/>OUR WORK <span>↗</span></Link></div> */}
      </div>
      <div className="world-hero-index"><span>01</span><i /> SELECTED RESIDENCES</div>
      <div className="world-hero-side">RESIDENTIAL&nbsp; / &nbsp;KITCHENS&nbsp; / &nbsp;LIVING</div>
    </section>

    <div className="world-marquee" aria-label="Spaces that inspire"><div>DESIGN THAT FEELS PERSONAL <b>✳</b> DETAILS THAT MAKE A DIFFERENCE <b>✳</b> SPACES MADE TO LIVE IN <b>✳</b>&nbsp;</div></div>

    <section className="world-studio">
      <div className="world-studio-label"><span>01</span><i/> THE STUDIO</div>
      <div className="world-studio-copy"><p className="world-kicker">A DIFFERENT WAY TO THINK ABOUT HOME</p><h2>Good design is<br/>felt, <em>not just seen.</em></h2><p className="world-body">At M² Interiors, we bring together thoughtful planning, expressive materials and finely resolved details to create spaces that feel personal. From the first idea to the final finish, every decision has a purpose — and every room has a point of view.</p><Link href="/services" className="world-text-link">DISCOVER THE STUDIO <span>↗</span></Link></div>
      <div className="world-studio-photo"><Image src="/images/project-12.jpg" alt="Timber partition framing a contemporary living room" fill sizes="(max-width: 760px) 100vw, 42vw"/><span>THE ART OF EVERYDAY LIVING / M²</span></div>
    </section>

    <section className="world-services" id="services">
      <div className="world-services-top"><p className="world-kicker">02 / WHAT WE DO</p><h2>From the big picture<br/>to the <em>finest detail.</em></h2><p className="world-body">A considered approach to the spaces you use every day. Design, planning and details — brought together as one.</p></div>
      <div className="world-service-list">{services.map(([n,t,d])=><Link href="/services" className="world-service" key={n}><span className="world-service-no">{n}</span><strong>{t}</strong><span className="world-service-desc">{d}</span><span className="world-service-arrow">↗</span></Link>)}</div>
    </section>


    <section className="world-film">
      <div className="world-film-head"><div><p className="world-kicker">03 / INSIDE THE DETAILS</p><h2>Take a closer<br/><em>look around.</em></h2></div><p className="world-body">A space is more than a photograph. Explore the flow, finishes and moments that bring each interior to life.</p></div>
      <div className="world-film-feature"><video controls preload="metadata" playsInline poster="/images/project-08.webp"><source src="/videos/project-film-1.mp4" type="video/mp4"/></video><div className="world-film-caption"><span>FILM 01 / THE RESIDENCE</span><span>M² INTERIORS&nbsp; ↗</span></div></div>
    </section>

    <section className="world-gallery-invite">
      <div>
        <p className="world-kicker">04 / THE M² COLLECTION</p>
        <h2>A closer look at<br/><em>the spaces we create.</em></h2>
        <p className="world-body">Explore our complete collection of interior photographs and films in one place.</p>
      </div>
      <Link href="/gallery" className="world-contact-button">VIEW ALL PHOTOS &amp; VIDEOS <span>↗</span></Link>
    </section>

    <section className="world-contact"><p className="world-kicker">05 / YOUR NEXT CHAPTER STARTS HERE</p><h2>Let’s make<br/><em>space for living.</em></h2><div className="world-contact-bottom"><p>Have a space in mind? Tell us what you're imagining. We'd love to hear about it.</p><Link href="/contact" className="world-contact-button">START A CONVERSATION <span>↗</span></Link></div><div className="world-contact-mark">M²</div></section>
  </>;
}
