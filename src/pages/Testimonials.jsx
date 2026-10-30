import {useSite} from '../lib/site';import PageHero from '../components/PageHero';
export default function Testimonials(){const{col}=useSite();
return <><PageHero k="testimonials"/><section className="wrap sec"><div className="grid2">{col.testimonials.map(t=><figure key={t.id} className="card tcard"><div className="stars" aria-label={t.rating+' out of 5'}>{'★'.repeat(t.rating)}</div><blockquote>“{t.text}”</blockquote><figcaption><img src={t.avatar} alt={t.name}/><span><b>{t.name}</b><small>{t.role}</small></span></figcaption></figure>)}</div></section></>}
