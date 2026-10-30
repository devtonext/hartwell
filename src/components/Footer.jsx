import {useState} from 'react';import {useSite} from '../lib/site';import {api} from '../lib/api';import {SmartLink,PillBtn,Lines} from './ui';
const pair=s=>{const[a,b]=s.split('|');return[a,b]};
const links=[['/','Home'],['/about','About'],['/projects','Projects'],['/blog','Blogs'],['/testimonials','Testimonials'],['/contact','Contact']];
export default function Footer(){const{content:c,col}=useSite(),f=c.footer,k=c.contact,g=c.general;
const[email,setEmail]=useState(''),[st,setSt]=useState('idle');
async function sub(e){e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(email)){setSt('error');return}setSt('loading');
try{await api.submit('subscribers',{email});setSt('done');setEmail('')}catch{setSt('error')}}
return <footer className="foot"><div className="wrap">
<div className="fcta"><h2>{f.cta_title}<br/><span className="fscript">{f.cta_accent}</span></h2><PillBtn to={f.cta_link}>{f.cta_btn}</PillBtn></div>
<div className="fgrid">
<div><SmartLink to="/" className="logo"><b>{g.brand[0]}</b>{g.brand}.</SmartLink><p>{f.about}</p>
<div className="socials">{k.socials.map(s=>{const[n,u]=pair(s);return <a key={n} href={u} target="_blank" rel="noreferrer" aria-label={n}>{n[0]}</a>})}</div></div>
<div><h4>Quick Links</h4><ul>{links.map(([t,l])=><li key={t}><SmartLink to={t}>{l}</SmartLink></li>)}</ul></div>
<div><h4>Services</h4><ul>{col.services.map(s=><li key={s.id}><SmartLink to="/services">{s.title}</SmartLink></li>)}</ul></div>
<div><h4>Contact</h4><ul className="cl"><li><a href={`mailto:${k.email}`}>{k.email}</a></li><li><a href={`tel:${k.phone.replace(/[^+\d]/g,'')}`}>{k.phone}</a></li><li>{k.address}</li><li>{k.hours}</li></ul></div>
<div><h4>{f.news_title}</h4><p>{f.news_text}</p>
<form className="news" onSubmit={sub} noValidate><input type="email" placeholder="Your email" value={email} onChange={e=>{setEmail(e.target.value);setSt('idle')}} aria-label="Email address"/><button disabled={st==='loading'}>{st==='loading'?'…':f.news_btn}</button></form>
<small className={'nmsg '+st} role="status">{st==='done'?'Thanks! You’re subscribed.':st==='error'?'Please enter a valid email.':''}</small></div></div>
<div className="fbar"><span>{g.footer_text}</span><span className="legal">{f.legal_links.map(l=>{const[t,u]=pair(l);return <SmartLink key={t} to={u}>{t}</SmartLink>})}</span></div></div></footer>}
