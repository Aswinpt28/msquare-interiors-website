'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { projects } from '@/data/projects';
const filters=['All','Kitchen','Living','Bedroom','Dining'];
export default function ProjectGrid({limit}:{limit?:number}){
 const [active,setActive]=useState('All');
 const shown=useMemo(()=>projects.filter(p=>active==='All'||p.category===active).slice(0,limit??projects.length),[active,limit]);
 return <><div className="filter-row">{filters.map(f=><button key={f} className={active===f?'filter active':'filter'} onClick={()=>setActive(f)}>{f}</button>)}</div><div className="project-grid">{shown.map((p,i)=><Link href="/contact" className={`project-card card-${i%3}`} key={p.id}><div className="project-image"><Image src={p.image} alt={p.title} fill sizes="(max-width: 700px) 100vw, 33vw"/><span className="project-arrow">↗</span></div><div className="project-meta"><div><span>{p.location}</span><h3>{p.title}</h3></div><span className="project-number">0{p.id}</span></div></Link>)}</div></>
}
