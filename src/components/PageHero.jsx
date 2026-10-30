import {useEffect} from 'react';import {Link} from 'react-router-dom';import {useSite} from '../lib/site';
export const usePageTitle=t=>{const{content:c}=useSite();useEffect(()=>{document.title=t?`${t} — ${c.general.brand}`:c.seo.title},[t,c])};
export default function PageHero({k,title,sub}){const{content:c}=useSite(),p=c.pages[k]||{};const T=title||p.title;usePageTitle(T);
return <section className="phero"><div className="wrap"><nav className="crumb" aria-label="Breadcrumb"><Link to="/">Home</Link> / <span>{T}</span></nav><h1>{T}</h1><p className="muted">{sub||p.sub}</p></div></section>}
