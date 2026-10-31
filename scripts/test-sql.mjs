import {PGlite} from '@electric-sql/pglite';import {readFileSync} from 'node:fs';
const db=new PGlite(),sql=readFileSync('supabase/setup.sql','utf8');let fail=0;
const ok=(n,c)=>{console.log((c?'PASS ':'FAIL ')+n);if(!c)fail++};
await db.exec(`create role anon nologin;create role authenticated nologin;create schema auth;create table auth.users(id uuid primary key default gen_random_uuid(),email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create schema storage;create table storage.buckets(id text primary key,name text,public boolean);create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
grant usage on schema auth,storage,public to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;grant select,insert,update,delete on storage.objects to anon,authenticated;`);
await db.exec(sql);await db.exec(sql);ok('setup.sql runs twice (idempotent)',true);
const as=async(role,sub,fn)=>{await db.exec(`set role ${role}`);await db.query(`select set_config('request.jwt.claim.sub',$1,false)`,[sub||'']);try{return await fn()}finally{await db.exec('reset role')}};
const tryq=async(s,p)=>{try{return{r:await db.query(s,p)}}catch(e){return{e:e.message}}};
const cnt=async s=>+(await db.query(s)).rows[0].c;
ok('seed filled collections',await cnt('select count(*) c from posts')===4&&await cnt('select count(*) c from site_content')>5);
ok('admin_exists false before signup',(await db.query('select public.admin_exists() v')).rows[0].v===false);
const a=(await db.query(`insert into auth.users(email) values('a@x.com') returning id`)).rows[0].id;
const b=(await db.query(`insert into auth.users(email) values('b@x.com') returning id`)).rows[0].id;
ok('first signup becomes admin, second does not',await cnt(`select count(*) c from admin_users where user_id='${a}'`)===1&&await cnt(`select count(*) c from admin_users where user_id='${b}'`)===0);
await db.exec(`insert into posts(title,slug,published,sort_order) values('Hidden','hidden',false,99)`);
await as('anon',null,async()=>{
 ok('anon reads published only',await cnt('select count(*) c from posts')===4&&await cnt('select count(*) c from site_content')>5);
 ok('anon can insert message (status new)',!(await tryq(`insert into contact_messages(name,email,message) values('t','t@t.com','hello there')`)).e);
 ok('anon cannot force status',!!(await tryq(`insert into contact_messages(name,email,message,status) values('t','t@t.com','x','replied')`)).e);
 ok('anon cannot read submissions',!!(await tryq('select * from contact_messages')).e);
 ok('anon cannot write posts',!!(await tryq(`insert into posts(title) values('x')`)).e);
 ok('anon subscribe works, duplicate email rejected',!(await tryq(`insert into subscribers(email) values('n@n.com')`)).e&&!!(await tryq(`insert into subscribers(email) values('N@n.com')`)).e);
 ok('anon cannot read admin_users',!!(await tryq('select * from admin_users')).e);});
await as('authenticated',b,async()=>{
 ok('non-admin sees published only',await cnt('select count(*) c from posts')===4);
 ok('non-admin cannot update posts',(await db.query(`update posts set title='h' returning id`)).rows.length===0);
 ok('non-admin cannot read submissions',await cnt('select count(*) c from contact_messages')===0);
 ok('is_admin false for non-admin',(await db.query('select public.is_admin() v')).rows[0].v===false);});
await as('authenticated',a,async()=>{
 ok('admin sees hidden rows',await cnt('select count(*) c from posts')===5);
 ok('admin can update posts',(await db.query(`update posts set title='Edited' where slug='hidden' returning id`)).rows.length===1);
 ok('admin reads submissions & subscribers',await cnt('select count(*) c from contact_messages')>=2&&await cnt('select count(*) c from subscribers')>=2);
 ok('admin can write content',!(await tryq(`update site_content set data='{}' where key='seo'`)).e);
 ok('admin can write storage',!(await tryq(`insert into storage.objects(bucket_id,name) values('media','a.png')`)).e);});
await as('authenticated',b,async()=>ok('non-admin cannot write storage',!!(await tryq(`insert into storage.objects(bucket_id,name) values('media','b.png')`)).e));
console.log(fail?`\n${fail} FAILED`:'\nAll SQL checks passed');process.exit(fail?1:0);
