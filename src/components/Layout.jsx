import {NavLink,Outlet,Link} from 'react-router-dom';import {useSite} from '../lib/site';import {SmartLink} from './ui';import Footer from './Footer';
const nav=[['/','Home'],['/services','Services'],['/about','About'],['/projects','Projects'],['/blog','Blogs'],['/testimonials','Testimonials']];
export default function Layout(){const{content:{general:g}}=useSite();
return <><a className="skip" href="#main">Skip to content</a>
{g.announce_on&&<div className="announce"><SmartLink to={g.announce_link}>{g.announce_text}</SmartLink></div>}
<header className="wrap"><div className="nav"><Link to="/" className="logo"><b>{g.brand[0]}</b>{g.brand}.</Link>
<nav>{nav.map(([t,l])=><NavLink key={t} to={t} end={t==='/'}>{l}</NavLink>)}</nav><SmartLink to={g.cta_link} className="navcta">{g.cta_label}</SmartLink></div></header>
<main id="main"><Outlet/></main><Footer/></>}
