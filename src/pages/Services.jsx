import {useState} from 'react';import {useSite} from '../lib/site';import PageHero from '../components/PageHero';import {PillBtn} from '../components/ui';
export default function Services(){const{col}=useSite(),[o,setO]=useState(0);
return <><PageHero k="services"/><section className="wrap sec"><div className="grid3">{col.services.map(s=><article key={s.id} className="card"><span className="ico">{s.icon}</span><h3>{s.title}</h3><p className="muted">{s.text}</p></article>)}</div></section>
<section className="wrap sec faq"><h2 className="center">Frequently Asked <span className="script">Questions</span></h2><div className="acc">{col.faqs.map((f,i)=><div key={f.id} className={'ai'+(o===i?' open':'')}><button aria-expanded={o===i} onClick={()=>setO(o===i?-1:i)}>{f.question}<i>+</i></button><div className="ab"><p className="muted">{f.answer}</p></div></div>)}</div>
<div className="center" style={{marginTop:30}}><PillBtn to="/contact">Start a Project</PillBtn></div></section></>}
