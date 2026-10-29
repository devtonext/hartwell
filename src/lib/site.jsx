import {createContext,useContext,useEffect,useState,useCallback} from 'react';import {loadSite} from './api';
const Ctx=createContext(null);export const useSite=()=>useContext(Ctx);
export function SiteProvider({children}){const[s,setS]=useState(null);
const reload=useCallback(()=>loadSite().then(setS),[]);useEffect(()=>{reload()},[reload]);
useEffect(()=>{if(!s)return;const g=s.content.general,r=document.documentElement.style;r.setProperty('--primary',g.primary);r.setProperty('--accent',g.accent);
document.title=s.content.seo.title;let m=document.querySelector('meta[name=description]');if(!m){m=document.createElement('meta');m.name='description';document.head.appendChild(m)}m.content=s.content.seo.description},[s]);
if(!s)return <div className="loader"><span/></div>;return <Ctx.Provider value={{...s,reload}}>{children}</Ctx.Provider>}
