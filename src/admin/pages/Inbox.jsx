import {useCallback,useEffect,useState} from 'react';import {useParams} from 'react-router-dom';import {api} from '../../lib/api';import {SUBMISSIONS} from '../schema';import {Modal,Skel,csv,useToast} from '../ui';
export default function Inbox(){const{table}=useParams(),s=SUBMISSIONS.find(x=>x.table===table),toast=useToast();
const[rows,setRows]=useState(null),[q,setQ]=useState(''),[tab,setTab]=useState('all'),[open,setOpen]=useState(null);
const load=useCallback(()=>api.list(table,{admin:true}).then(setRows),[table]);useEffect(()=>{setRows(null);setTab('all');setQ('');load()},[load]);
if(!s)return <p>Inbox not found.</p>;
const run=async fn=>{try{await fn();await load()}catch(e){toast(e.message,'err')}};
const setSt=(r,st)=>run(()=>api.update(table,r.id,{status:st}));
const view=r=>{setOpen(r);if(r.status==='new'&&s.statuses.includes('read'))setSt(r,'read')};
const list=(rows||[]).filter(r=>(tab==='all'||r.status===tab)&&JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
const cols=[...s.fields.map(f=>f.key),'status','created_at'];
return <><div className="head"><h1>{s.label}</h1><button className="btn" disabled={!rows?.length} onClick={()=>csv(rows,cols,table)}>Export CSV</button></div>
<div className="tabs">{['all',...s.statuses].map(t=><button key={t} className={tab===t?'on':''} onClick={()=>setTab(t)}>{t} <em>{t==='all'?rows?.length??0:rows?.filter(r=>r.status===t).length??0}</em></button>)}</div>
<input className="search" placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)} aria-label="Search"/>
{!rows?<Skel/>:<div className="list">{list.map(r=><div key={r.id} className={'item'+(r.status==='new'?' unread':'')}><button className="itx linkish" onClick={()=>view(r)}><b>{r.name||r.email}</b><small>{r.subject||r.message||r.email}</small></button><small className="muted">{new Date(r.created_at).toLocaleDateString()}</small>
<select value={r.status} onChange={e=>setSt(r,e.target.value)} aria-label="Status">{s.statuses.map(x=><option key={x}>{x}</option>)}</select><button className="btn sm danger" onClick={()=>run(async()=>{await api.remove(table,r.id);toast('Deleted')})}>Delete</button></div>)}{!list.length&&<p className="muted">Nothing here.</p>}</div>}
{open&&<Modal title={open.subject||open.name||open.email} onClose={()=>setOpen(null)}><dl className="dl">{s.fields.map(f=><div key={f.key}><dt>{f.label}</dt><dd>{f.key==='email'?<a href={'mailto:'+open[f.key]}>{open[f.key]}</a>:/phone|tel/.test(f.key)?<a href={'tel:'+open[f.key]}>{open[f.key]}</a>:open[f.key]||'—'}</dd></div>)}<div><dt>Received</dt><dd>{new Date(open.created_at).toLocaleString()}</dd></div></dl>
{open.email&&<a className="btn primary" href={`mailto:${open.email}?subject=${encodeURIComponent('Re: '+(open.subject||''))}`}>Reply by email</a>}</Modal>}</>}
