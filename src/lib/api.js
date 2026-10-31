import {defaultContent,defaultCollections,defaultSubmissions} from './defaults';
const URL=import.meta.env.VITE_SUPABASE_URL,KEY=import.meta.env.VITE_SUPABASE_ANON_KEY,BUCKET=import.meta.env.VITE_SUPABASE_BUCKET||'media';
export const isDemo=!(URL&&KEY);
export const COLLECTION_TABLES=Object.keys(defaultCollections),SUBMISSION_TABLES=Object.keys(defaultSubmissions);
export const DEMO_LOGIN={email:'admin@demo.com',password:'demo1234'};
const ls={get(k,d){try{const v=localStorage.getItem('hw:'+k);return v?JSON.parse(v):d}catch{return d}},set(k,v){try{localStorage.setItem('hw:'+k,JSON.stringify(v))}catch{}},del(k){try{localStorage.removeItem('hw:'+k)}catch{}}};
let sb;const client=async()=>sb||(sb=(await import('@supabase/supabase-js')).createClient(URL,KEY));
const merge=m=>Object.fromEntries(Object.entries(defaultContent).map(([k,v])=>{const s=m[k]||{};const o={...v};for(const x in s)o[x]=v[x]&&typeof v[x]==='object'&&!Array.isArray(v[x])?{...v[x],...s[x]}:s[x];return[k,o]}));
const isSub=t=>SUBMISSION_TABLES.includes(t);
const sortRows=(t,r)=>[...r].sort(isSub(t)?(a,b)=>String(b.created_at).localeCompare(a.created_at):(a,b)=>(a.sort_order??0)-(b.sort_order??0));
const rows=t=>ls.get('t:'+t,defaultCollections[t]||defaultSubmissions[t]||[]);
const listeners=new Set();const emit=()=>listeners.forEach(f=>f(ls.get('session',null)));
const now=()=>new Date().toISOString();
const readFile=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)});
export const api={
async getContent(){if(isDemo)return merge(ls.get('content',{}));const c=await client();const{data}=await c.from('site_content').select('*');return merge(Object.fromEntries((data||[]).map(r=>[r.key,r.data])))},
async saveContent(key,data){if(isDemo){const s=ls.get('content',{});s[key]={...(s[key]||{}),...data};ls.set('content',s);return}
 const c=await client();const{data:cur}=await c.from('site_content').select('data').eq('key',key).maybeSingle();
 const{error}=await c.from('site_content').upsert({key,data:{...(cur?.data||{}),...data}});if(error)throw error},
async list(t,{admin}={}){let r;if(isDemo)r=rows(t);else{const c=await client();let q=c.from(t).select('*');if(!admin&&!isSub(t))q=q.eq('published',true);const{data,error}=await q;if(error)throw error;r=data||[]}
 if(!admin&&!isSub(t)&&isDemo)r=r.filter(x=>x.published);return sortRows(t,r)},
async insert(t,row){if(isDemo){const r=rows(t);const n=r.reduce((m,x)=>Math.max(m,x.sort_order||0),0)+1;const nr={published:true,sort_order:n,...row,id:crypto.randomUUID(),created_at:now(),updated_at:now()};ls.set('t:'+t,[...r,nr]);return nr}
 const c=await client();if(!isSub(t)&&row.sort_order==null){const{data:m}=await c.from(t).select('sort_order').order('sort_order',{ascending:false}).limit(1);row={...row,sort_order:(m?.[0]?.sort_order||0)+1}}
 const{data,error}=await c.from(t).insert(row).select().single();if(error)throw error;return data},
async update(t,id,patch){if(isDemo){ls.set('t:'+t,rows(t).map(x=>x.id===id?{...x,...patch,updated_at:now()}:x));return}
 const c=await client();const{error}=await c.from(t).update(patch).eq('id',id);if(error)throw error},
async remove(t,id){if(isDemo){ls.set('t:'+t,rows(t).filter(x=>x.id!==id));return}const c=await client();const{error}=await c.from(t).delete().eq('id',id);if(error)throw error},
async submit(t,row){if(isDemo){ls.set('t:'+t,[{...row,id:crypto.randomUUID(),status:t==='subscribers'?'active':'new',created_at:now()},...rows(t)]);return}
 const c=await client();const{error}=await c.from(t).insert(row);if(error)throw error},
async getSession(){if(isDemo)return ls.get('session',null);const c=await client();return(await c.auth.getSession()).data.session},
async signIn(email,password){if(isDemo){if(email!==DEMO_LOGIN.email||password!==DEMO_LOGIN.password)throw new Error('Invalid demo credentials');ls.set('session',{user:{id:'demo',email}});emit();return}
 const c=await client();const{error}=await c.auth.signInWithPassword({email,password});if(error)throw error},
async signUp(email,password){if(isDemo)throw new Error('Sign-up is disabled in demo mode');const c=await client();const{error}=await c.auth.signUp({email,password});if(error)throw error},
async signOut(){if(isDemo){ls.del('session');emit();return}const c=await client();await c.auth.signOut()},
onAuthChange(cb){if(isDemo){listeners.add(cb);return()=>listeners.delete(cb)}let off=()=>{},dead=false;client().then(c=>{const{data}=c.auth.onAuthStateChange((_e,s)=>cb(s));dead?data.subscription.unsubscribe():off=()=>data.subscription.unsubscribe()});return()=>{dead=true;off()}},
async isAdmin(){if(isDemo)return!!ls.get('session',null);const c=await client();const{data}=await c.rpc('is_admin');return!!data},
async adminExists(){if(isDemo)return true;const c=await client();const{data}=await c.rpc('admin_exists');return!!data},
async listMedia(){if(isDemo)return ls.get('media',[]);const c=await client();const{data}=await c.storage.from(BUCKET).list('',{limit:300,sortBy:{column:'created_at',order:'desc'}});
 return(data||[]).filter(x=>x.name&&x.id).map(x=>({name:x.name,size:x.metadata?.size||0,url:c.storage.from(BUCKET).getPublicUrl(x.name).data.publicUrl}))},
async uploadMedia(file){if(!file.type.startsWith('image/'))throw new Error('Only images are allowed');
 if(isDemo){if(file.size>1.5*1024*1024)throw new Error('Demo uploads are limited to 1.5 MB');const url=await readFile(file);const m={name:file.name,size:file.size,url};ls.set('media',[m,...ls.get('media',[])]);return m}
 const c=await client();const name=Date.now()+'-'+file.name.replace(/[^\w.-]/g,'_');const{error}=await c.storage.from(BUCKET).upload(name,file);if(error)throw error;
 return{name,size:file.size,url:c.storage.from(BUCKET).getPublicUrl(name).data.publicUrl}},
async deleteMedia(m){if(isDemo){ls.set('media',ls.get('media',[]).filter(x=>x.url!==m.url));return}const c=await client();const{error}=await c.storage.from(BUCKET).remove([m.name]);if(error)throw error},
resetDemo(){Object.keys(localStorage).filter(k=>k.startsWith('hw:')).forEach(k=>localStorage.removeItem(k))}};
export async function loadSite(){const[content,...r]=await Promise.all([api.getContent(),...COLLECTION_TABLES.map(t=>api.list(t))]);return{content,col:Object.fromEntries(COLLECTION_TABLES.map((t,i)=>[t,r[i]]))}}
