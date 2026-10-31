import {createContext,useContext,useState,useCallback,useEffect} from 'react';
const T=createContext(()=>{});export const useToast=()=>useContext(T);
export function ToastProvider({children}){const[l,setL]=useState([]);
const push=useCallback((m,k='ok')=>{const id=Math.random();setL(x=>[...x,{id,m,k}]);setTimeout(()=>setL(x=>x.filter(i=>i.id!==id)),3200)},[]);
return <T.Provider value={push}>{children}<div className="toasts" role="status" aria-live="polite">{l.map(t=><div key={t.id} className={'toast '+t.k}>{t.m}</div>)}</div></T.Provider>}
export function Modal({title,onClose,children,wide}){useEffect(()=>{const h=e=>e.key==='Escape'&&onClose();addEventListener('keydown',h);return()=>removeEventListener('keydown',h)},[onClose]);
return <div className="mbg" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={'modal'+(wide?' wide':'')} role="dialog" aria-modal="true" aria-label={title}><header><h3>{title}</h3><button className="x" onClick={onClose} aria-label="Close">×</button></header><div className="mbody">{children}</div></div></div>}
export const Skel=({n=4})=><div className="skels">{Array.from({length:n},(_,i)=><div key={i} className="skel"/>)}</div>;
export const csv=(rows,cols,name)=>{const e=v=>'"'+String(Array.isArray(v)?v.join('; '):v??'').replace(/"/g,'""')+'"';
 const b=new Blob([[cols.map(e).join(','),...rows.map(r=>cols.map(c=>e(r[c])).join(','))].join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name+'.csv';a.click()};
