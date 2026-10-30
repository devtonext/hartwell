import {useState} from 'react';import {useSearchParams} from 'react-router-dom';import {useSite} from '../lib/site';import {api} from '../lib/api';import PageHero from '../components/PageHero';
export default function Contact(){const{content:c}=useSite(),p=c.pages.contact,k=c.contact,[sp]=useSearchParams();
const[v,setV]=useState({name:'',email:'',subject:sp.get('subject')||'',message:''}),[err,setErr]=useState({}),[st,setSt]=useState('idle');
const set=e=>setV({...v,[e.target.name]:e.target.value});
async function go(e){e.preventDefault();const x={};if(v.name.trim().length<2)x.name='Please enter your name';if(!/^\S+@\S+\.\S+$/.test(v.email))x.email='Enter a valid email';if(v.message.trim().length<10)x.message='Tell me a little more (10+ characters)';setErr(x);if(Object.keys(x).length)return;
setSt('loading');try{await api.submit('contact_messages',{name:v.name,email:v.email,subject:v.subject,message:v.message});setSt('done');setV({name:'',email:'',subject:'',message:''})}catch{setSt('error')}}
const F=({n,l,t='text',area})=><label>{l}{area?<textarea name={n} rows="5" value={v[n]} onChange={set}/>:<input name={n} type={t} value={v[n]} onChange={set}/>}{err[n]&&<em>{err[n]}</em>}</label>;
return <><PageHero k="contact"/><section className="wrap sec cgrid"><div className="cinfo"><h3>Let’s talk</h3><p className="muted">{p.sub}</p><ul><li><b>Email</b><a href={'mailto:'+k.email}>{k.email}</a></li><li><b>Phone</b><a href={'tel:'+k.phone.replace(/[^+\d]/g,'')}>{k.phone}</a></li><li><b>Studio</b>{k.address}</li><li><b>Hours</b>{k.hours}</li></ul></div>
{st==='done'?<div className="card success" role="status"><h3>Message sent ✓</h3><p className="muted">{p.success}</p><button className="ghost" onClick={()=>setSt('idle')}>Send another</button></div>:
<form className="card cform" onSubmit={go} noValidate><div className="two"><F n="name" l="Your name"/><F n="email" l="Email" t="email"/></div><F n="subject" l="Subject"/><F n="message" l="Message" area/>
{st==='error'&&<em>Something went wrong. Please try again.</em>}<button className="submit" disabled={st==='loading'}>{st==='loading'?'Sending…':p.form_btn}</button></form>}</section></>}
