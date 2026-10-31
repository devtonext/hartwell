import {useState,useEffect,useRef} from 'react';import {api} from '../lib/api';import {Modal,useToast} from './ui';
export const slugify=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const fmtSize=b=>b>1048576?(b/1048576).toFixed(1)+' MB':Math.max(1,Math.round(b/1024))+' KB';
export function MediaPicker({onPick,onClose}){const[m,setM]=useState(null);useEffect(()=>{api.listMedia().then(setM)},[]);
return <Modal title="Media library" onClose={onClose} wide>{!m?<p>Loading…</p>:!m.length?<p className="muted">No uploads yet. Use the Media page or upload from the field.</p>:<div className="mgrid">{m.map(x=><button key={x.url} className="mitem" onClick={()=>onPick(x.url)}><img src={x.url} alt={x.name}/><small>{x.name}</small></button>)}</div>}</Modal>}
export function ImageField({value,onChange}){const toast=useToast(),ref=useRef(),[lib,setLib]=useState(false),[busy,setBusy]=useState(false),[drag,setDrag]=useState(false);
async function up(file){if(!file)return;setBusy(true);try{onChange((await api.uploadMedia(file)).url)}catch(e){toast(e.message,'err')}setBusy(false)}
return <div className={'imgf'+(drag?' drag':'')} onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);up(e.dataTransfer.files[0])}}>
{value?<img src={value} alt="" className="prev"/>:<div className="prev empty">Drop an image here</div>}
<div className="imgctl"><input value={value||''} onChange={e=>onChange(e.target.value)} placeholder="Paste image URL"/><div className="btnrow">
<button type="button" className="btn sm" onClick={()=>ref.current.click()} disabled={busy}>{busy?'Uploading…':'Upload'}</button><button type="button" className="btn sm" onClick={()=>setLib(true)}>Library</button>{value&&<button type="button" className="btn sm danger" onClick={()=>onChange('')}>Remove</button>}</div></div>
<input ref={ref} type="file" accept="image/*" hidden onChange={e=>{up(e.target.files[0]);e.target.value=''}}/>{lib&&<MediaPicker onClose={()=>setLib(false)} onPick={u=>{onChange(u);setLib(false)}}/>}</div>}
export function Field({f,value,onChange,row={}}){const v=value??'',id='f-'+f.key;
if(f.type==='boolean')return <label className="sw"><input type="checkbox" checked={!!value} onChange={e=>onChange(e.target.checked)}/><span/>{f.label}</label>;
let c;switch(f.type){
case'textarea':case'markdown':c=<textarea id={id} rows={f.type==='markdown'?9:4} value={v} onChange={e=>onChange(e.target.value)}/>;break;
case'title':c=<textarea id={id} rows={2} value={v} onChange={e=>onChange(e.target.value)} placeholder="Use a new line for a line break"/>;break;
case'list':c=<textarea id={id} rows={4} value={(Array.isArray(value)?value:[]).join('\n')} onChange={e=>onChange(e.target.value.split('\n'))} placeholder="One per line"/>;break;
case'tags':c=<input id={id} value={(Array.isArray(value)?value:[]).join(', ')} onChange={e=>onChange(e.target.value.split(',').map(x=>x.trimStart()))} placeholder="Comma, separated"/>;break;
case'number':c=<input id={id} type="number" value={v} onChange={e=>onChange(e.target.value===''?0:Number(e.target.value))}/>;break;
case'select':c=<select id={id} value={v} onChange={e=>onChange(e.target.value)}>{f.options.map(o=><option key={o}>{o}</option>)}</select>;break;
case'color':c=<div className="colr"><input type="color" value={/^#[0-9a-f]{6}$/i.test(v)?v:'#000000'} onChange={e=>onChange(e.target.value)} aria-label={f.label}/><input id={id} value={v} onChange={e=>onChange(e.target.value)}/></div>;break;
case'date':c=<input id={id} type="date" value={String(v).slice(0,10)} onChange={e=>onChange(e.target.value)}/>;break;
case'slug':c=<div className="colr"><input id={id} value={v} onChange={e=>onChange(slugify(e.target.value))}/><button type="button" className="btn sm" onClick={()=>onChange(slugify(row.title))}>Generate</button></div>;break;
case'image':c=<ImageField value={v} onChange={onChange}/>;break;
default:c=<input id={id} type={f.type==='url'?'text':'text'} value={v} onChange={e=>onChange(e.target.value)} placeholder={f.type==='url'?'/path or https://…':''}/>}
return <div className="fld"><label htmlFor={id}>{f.label}</label>{c}</div>}
