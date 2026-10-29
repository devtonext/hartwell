import {useSite} from '../lib/site';import {Lines,PillBtn,SmartLink} from '../components/ui';
export default function Home(){const{content:c,col}=useSite(),h=c.hero,a=c.about,sv=c.services_intro,t=c.tools_intro,pj=c.projects_intro,jn=c.journey_intro;
const mq=[...h.marquee,...h.marquee,...h.marquee];
return <>
<section className="wrap hero"><div><span className="badge">{h.badge}</span>
<h1><em>{h.title_pre}</em><span className="script">{h.name}</span><br/><Lines text={h.title}/></h1><p className="muted">{h.text}</p>
<div className="row"><PillBtn to={h.btn1_link} icon="▶">{h.btn1}</PillBtn><SmartLink to={h.btn2_link} className="ghost">{h.btn2}</SmartLink></div></div>
<div className="heroimg"><div className="blob"/><img src={h.image} alt={c.general.brand}/><a href={h.btn2_link} className="hire" aria-label="Hire me"><svg viewBox="0 0 100 100"><defs><path id="c" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><text fontSize="11" fontWeight="700" fill="#fff" letterSpacing="2"><textPath href="#c">HIRE ME • HIRE ME • HIRE ME •</textPath></text></svg><i>↗</i></a><span className="cur c1"/><span className="cur c2"/><span className="chip amber">{h.chip2}</span><span className="chip dark">{h.chip1}</span></div></section>
<div className="marquee"><div>{mq.map((m,i)=><span key={i}>{m}<b>✳</b></span>)}</div></div>
<section className="wrap sec"><div className="split"><div><small className="eyebrow">{sv.eyebrow}</small><h2><span className="script">{sv.title}</span> {sv.title_accent}</h2></div><PillBtn to={sv.link}>{sv.btn}</PillBtn></div>
<div className="grid3">{col.services.map(s=><article key={s.id} className="card"><span className="ico">{s.icon}</span><h3>{s.title}</h3><p className="muted">{s.text}</p><SmartLink to="/services">Learn more →</SmartLink></article>)}</div></section>
<section className="green"><div className="wrap about"><div className="aimg"><div className="blob round"/><img src={a.image} alt=""/></div>
<div><small className="eyebrow">{a.eyebrow}</small><h2>{a.title} <span className="script">{a.name}</span></h2><p className="soft">{a.text}</p>
<div className="stats">{col.stats.map(s=><div key={s.id}><b>{s.value}</b><span>{s.label}</span></div>)}</div>
<div className="row"><PillBtn to={a.cv_link}>{a.btn}</PillBtn><span className="sig">{a.signature}</span></div></div></div></section>
<section className="wrap sec center"><small className="eyebrow">{t.eyebrow}</small><h2><span className="script">{t.title_accent}</span><br/>{t.title}</h2>
<div className="tools">{col.tools.map(x=><div key={x.id} className="tool"><span style={{background:x.color}}>{x.abbr}</span><b>{x.percent}%</b><small>{x.name}</small></div>)}</div></section>
<section className="grey"><div className="wrap sec"><div className="split"><div><small className="eyebrow">{pj.eyebrow}</small><h2><span className="script">{pj.title_accent}</span> {pj.title}</h2></div><PillBtn to={pj.link}>{pj.btn}</PillBtn></div>
<div className="grid2">{col.projects.map(p=><article key={p.id} className="pcard"><SmartLink to={p.link}><img src={p.image} alt={p.title}/></SmartLink>
<div className="tags">{p.tags.map(g=><span key={g}>{g}</span>)}</div><div className="ptitle"><h3>{p.title}</h3><SmartLink to={p.link} className="arrow" aria-label="Open project">→</SmartLink></div></article>)}</div></div></section>
<section className="wrap sec center"><small className="eyebrow">{jn.eyebrow}</small><h2>{jn.title} <span className="script">{jn.title_accent}</span><br/>{jn.title2}</h2>
<div className="grid2 jgrid">{['education','work'].map(k=><div key={k} className="jcol"><h3>{k==='work'?'Work Experience':'Education'}</h3>{col.journey.filter(j=>j.kind===k).map(j=><div key={j.id} className="jitem"><span className="period">{j.period}</span><b>{j.title}</b><small>{j.place}</small></div>)}</div>)}</div></section></>}
