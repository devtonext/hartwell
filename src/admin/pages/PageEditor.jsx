import {useEffect,useState} from 'react';import {Link,useParams} from 'react-router-dom';import {api} from '../../lib/api';import {useSite} from '../../lib/site';import {PAGES,COLLECTIONS,sectionFields,sectionLabel} from '../schema';import {Field} from '../fields';import {useToast} from '../ui';
const get=(o,p)=>p.split('.').reduce((a,k)=>a?.[k],o);
const put=(o,p,v)=>{const[k,...r]=p.split('.');return{...o,[k]:r.length?put(o[k]||{},r.join('.'),v):v}};
function Card({sk}){const{content,reload}=useSite(),toast=useToast(),base=content[sk],fields=sectionFields(sk);const[d,setD]=useState(base);useEffect(()=>setD(base),[base]);
const dirty=JSON.stringify(d)!==JSON.stringify(base);
async function save(){let o=d;fields.filter(f=>f.type==='list').forEach(f=>{o=put(o,f.key,(get(o,f.key)||[]).map(x=>x.trim()).filter(Boolean))});
 try{await api.saveContent(sk,o);await reload();toast(sectionLabel(sk)+' saved')}catch(e){toast(e.message,'err')}}
return <section className="panel"><div className="phead"><h3>{sectionLabel(sk)} {dirty&&<em className="unsaved">Unsaved</em>}</h3><div className="btnrow"><button className="btn" disabled={!dirty} onClick={()=>setD(base)}>Discard</button><button className="btn primary" disabled={!dirty} onClick={save}>Save</button></div></div>
<div className="fgrid">{fields.map(f=><div key={f.key} className={['textarea','title','list','image'].includes(f.type)?'full':''}><Field f={f} value={get(d,f.key)} onChange={v=>setD(put(d,f.key,v))}/></div>)}</div></section>}
export default function PageEditor(){const{key}=useParams(),p=PAGES.find(x=>x.key===key);if(!p)return <p>Page not found.</p>;
return <><div className="head"><h1>{p.label}</h1><div className="btnrow"><Link className="btn" to={p.path} target="_blank">Preview page ↗</Link></div></div>
{!!p.collections.length&&<div className="chips"><span className="muted">Collections used here:</span>{p.collections.map(t=><Link key={t} className="chip" to={'/admin/c/'+t}>{COLLECTIONS.find(c=>c.table===t).label}</Link>)}</div>}
{p.sections.map(s=><Card key={p.key+s} sk={s}/>)}</>}
