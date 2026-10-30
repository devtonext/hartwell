import {useSite} from '../lib/site';import {PillBtn} from './ui';
export default function AboutBlock(){const{content:c,col}=useSite(),a=c.about;
return <section className="green"><div className="wrap about"><div className="aimg"><div className="acirc"/><img src={a.image} alt={a.name}/></div>
<div><small className="eyebrow">{a.eyebrow}</small><h2>{a.title} <span className="script">{a.name}</span></h2><p className="soft">{a.text}</p>
<div className="stats">{col.stats.map(s=><div key={s.id}><b>{s.value}</b><span>{s.label}</span></div>)}</div>
<div className="row"><PillBtn to={a.cv_link}>{a.btn}</PillBtn><span className="sig">{a.signature}</span></div></div></div></section>}
