import {useSite} from '../lib/site';import {Lines,PillBtn,SmartLink} from '../components/ui';
export default function Home(){const{content:c,col}=useSite(),h=c.hero,a=c.about,sv=c.services_intro,t=c.tools_intro;
const mq=[...h.marquee,...h.marquee,...h.marquee];
return <>
<section className="wrap hero"><div><span className="badge">{h.badge}</span>
<h1><em>{h.title_pre}</em><span className="script">{h.name}</span><br/><Lines text={h.title}/></h1><p className="muted">{h.text}</p>
<div className="row"><PillBtn to={h.btn1_link} icon="▶">{h.btn1}</PillBtn><SmartLink to={h.btn2_link} className="ghost">{h.btn2}</SmartLink></div></div>
<div className="heroimg"><div className="blob"/><img src={h.image} alt={c.general.brand}/><span className="chip amber">{h.chip2}</span><span className="chip dark">{h.chip1}</span></div></section>
<div className="marquee"><div>{mq.map((m,i)=><span key={i}>{m}<b>✳</b></span>)}</div></div>
<section className="wrap sec"><div className="split"><div><small className="eyebrow">{sv.eyebrow}</small><h2><span className="script">{sv.title}</span> {sv.title_accent}</h2></div><PillBtn to={sv.link}>{sv.btn}</PillBtn></div>
<div className="grid3">{col.services.map(s=><article key={s.id} className="card"><span className="ico">{s.icon}</span><h3>{s.title}</h3><p className="muted">{s.text}</p><SmartLink to="/services">Learn more →</SmartLink></article>)}</div></section>
<section className="green"><div className="wrap about"><div className="aimg"><div className="blob round"/><img src={a.image} alt=""/></div>
<div><small className="eyebrow">{a.eyebrow}</small><h2>{a.title} <span className="script">{a.name}</span></h2><p className="soft">{a.text}</p>
<div className="stats">{col.stats.map(s=><div key={s.id}><b>{s.value}</b><span>{s.label}</span></div>)}</div>
<div className="row"><PillBtn to={a.cv_link}>{a.btn}</PillBtn><span className="sig">{a.signature}</span></div></div></div></section>
<section className="wrap sec center"><small className="eyebrow">{t.eyebrow}</small><h2><span className="script">{t.title_accent}</span><br/>{t.title}</h2>
<div className="tools">{col.tools.map(x=><div key={x.id} className="tool"><span style={{background:x.color}}>{x.name[0]}</span><small>{x.name}</small></div>)}</div></section></>}
