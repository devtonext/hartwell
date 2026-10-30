import {defaultContent,defaultCollections,defaultSubmissions} from './defaults';
const URL=import.meta.env.VITE_SUPABASE_URL,KEY=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isDemo=!(URL&&KEY);
const ls={get(k,d){try{const v=localStorage.getItem('hw:'+k);return v?JSON.parse(v):d}catch{return d}},set(k,v){try{localStorage.setItem('hw:'+k,JSON.stringify(v))}catch{}}};
let sb;const client=async()=>sb||(sb=(await import('@supabase/supabase-js')).createClient(URL,KEY));
const merge=m=>Object.fromEntries(Object.entries(defaultContent).map(([k,v])=>[k,{...v,...(m[k]||{})}]));
export const api={
async getContent(){if(isDemo)return merge(ls.get('content',{}));
 const c=await client();const{data}=await c.from('site_content').select('*');return merge(Object.fromEntries((data||[]).map(r=>[r.key,r.data])))},
async saveContent(key,data){if(isDemo){const s=ls.get('content',{});s[key]={...(s[key]||{}),...data};ls.set('content',s);return}
 const c=await client();await c.from('site_content').upsert({key,data})},
async list(table,{admin}={}){let rows;if(isDemo)rows=ls.get('t:'+table,defaultCollections[table]||defaultSubmissions[table]||[]);
 else{const c=await client();const{data}=await c.from(table).select('*');rows=data||[]}
 if(!admin&&rows[0]&&'published' in rows[0])rows=rows.filter(r=>r.published);
 return [...rows].sort((a,b)=>(a.sort_order??0)-(b.sort_order??0)||String(b.created_at).localeCompare(a.created_at))},
async submit(table,row){if(isDemo){const r=ls.get('t:'+table,defaultSubmissions[table]||[]);ls.set('t:'+table,[{...row,id:crypto.randomUUID(),status:'new',created_at:new Date().toISOString()},...r]);return}
 const c=await client();const{error}=await c.from(table).insert(row);if(error)throw error},
resetDemo(){Object.keys(localStorage).filter(k=>k.startsWith('hw:')).forEach(k=>localStorage.removeItem(k))}};
export async function loadSite(){const[content,services,stats,tools,projects,journey,posts,testimonials,faqs]=await Promise.all([api.getContent(),...['services','stats','tools','projects','journey','posts','testimonials','faqs'].map(t=>api.list(t))]);return{content,col:{services,stats,tools,projects,journey,posts,testimonials,faqs}}}
