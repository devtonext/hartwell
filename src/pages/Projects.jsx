import {useState} from 'react';import {useSite} from '../lib/site';import PageHero from '../components/PageHero';import {SmartLink} from '../components/ui';
export default function Projects(){const{col}=useSite(),[f,setF]=useState('All');const tags=['All',...new Set(col.projects.flatMap(p=>p.tags))];
const list=col.projects.filter(p=>f==='All'||p.tags.includes(f));
return <><PageHero k="projects"/><section className="wrap sec"><div className="filters" role="tablist">{tags.map(t=><button key={t} role="tab" aria-selected={f===t} className={f===t?'on':''} onClick={()=>setF(t)}>{t}</button>)}</div>
<div className="grid2">{list.map(p=><article key={p.id} className="pcard"><SmartLink to={p.link}><img src={p.image} alt={p.title}/></SmartLink><div className="tags">{p.tags.map(g=><span key={g}>{g}</span>)}</div><div className="ptitle"><h3>{p.title}</h3><SmartLink to={p.link} className="arrow" aria-label="Open">→</SmartLink></div></article>)}</div>
{!list.length&&<p className="center muted">No projects found.</p>}</section></>}
