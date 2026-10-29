import {Link} from 'react-router-dom';
export const SmartLink=({to='#',children,...p})=>/^(https?:|mailto:|tel:|#)/.test(to)?<a href={to} {...p}>{children}</a>:<Link to={to} {...p}>{children}</Link>;
export const Lines=({text=''})=>text.split('\n').map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>);
export const PillBtn=({to,children,icon='→'})=><SmartLink to={to} className="pill"><span>{children}</span><i>{icon}</i></SmartLink>;
