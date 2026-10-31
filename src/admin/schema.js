// Single source of truth for the dashboard AND the generated SQL.
import {defaultContent} from '../lib/defaults.js';
const f=(key,label,type='text',x={})=>({key,label,type,...x});
export const COLLECTIONS=[
{table:'services',label:'Services',title:'title',page:'/services',fields:[f('icon','Icon (short text)'),f('title','Title'),f('text','Description','textarea')]},
{table:'stats',label:'Stats',title:'label',page:'/',fields:[f('value','Value (e.g. 600+)'),f('label','Label')]},
{table:'tools',label:'Tools',title:'name',page:'/',fields:[f('name','Name'),f('abbr','Icon letters'),f('color','Tile colour','color'),f('percent','Skill %','number')]},
{table:'projects',label:'Projects',title:'title',image:'image',page:'/projects',fields:[f('title','Title'),f('tags','Tags','tags'),f('image','Image','image'),f('link','Link','url')]},
{table:'journey',label:'Education & Work',title:'title',page:'/about',fields:[f('kind','Type','select',{options:['education','work']}),f('period','Period'),f('title','Title'),f('place','Place')]},
{table:'posts',label:'Blog Posts',title:'title',image:'image',page:'/blog',fields:[f('title','Title'),f('slug','Slug','slug'),f('category','Category'),f('date','Date','date'),f('image','Image','image'),f('excerpt','Excerpt','textarea'),f('body','Body','markdown')]},
{table:'testimonials',label:'Testimonials',title:'name',image:'avatar',page:'/testimonials',fields:[f('name','Name'),f('role','Role'),f('rating','Rating (1-5)','number'),f('avatar','Photo','image'),f('text','Quote','textarea')]},
{table:'faqs',label:'FAQs',title:'question',page:'/services',fields:[f('question','Question'),f('answer','Answer','textarea')]}];
export const SUBMISSIONS=[
{table:'contact_messages',label:'Messages',statuses:['new','read','replied','archived'],def:'new',fields:[f('name','Name','text',{max:120}),f('email','Email','text',{max:200}),f('subject','Subject','text',{max:200}),f('message','Message','textarea',{max:5000})]},
{table:'subscribers',label:'Subscribers',statuses:['active','unsubscribed'],def:'active',unique:'email',fields:[f('email','Email','text',{max:200})]}];
export const PAGES=[
{key:'site',label:'Site Settings',path:'/',sections:['general','seo','contact','footer'],collections:[]},
{key:'home',label:'Home',path:'/',sections:['hero','services_intro','about','projects_intro','tools_intro','journey_intro'],collections:['services','stats','tools','projects','journey']},
{key:'inner',label:'Inner Pages',path:'/services',sections:['pages'],collections:['faqs','posts','testimonials']}];
const pretty=k=>k.split('_').join(' ').replace(/^./,c=>c.toUpperCase());
export const sectionLabel=pretty;
function infer(path,v){const k=path.split('.').pop();
 if(Array.isArray(v))return'list';if(typeof v==='boolean')return'boolean';
 if(/^(image|avatar|og_image)$/.test(k))return'image';if(/^(primary|accent|color)$/.test(k))return'color';
 if(/(link|url)$/.test(k))return'url';if(k==='title')return'title';
 if(/^(text|sub|about|description|message|success|announce_text|footer_text|news_text)$/.test(k)||String(v).length>70)return'textarea';return'text'}
export function sectionFields(key){const out=[];const walk=(o,pre)=>Object.entries(o).forEach(([k,v])=>{const p=pre+k;
 if(v&&typeof v==='object'&&!Array.isArray(v))walk(v,p+'.');else out.push({key:p,label:pretty(p.split('.').slice(-2).join(' ').replace('.',' · ')),type:infer(p,v)})});
 walk(defaultContent[key]||{},'');return out}
