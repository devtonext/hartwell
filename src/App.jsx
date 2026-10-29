import {Routes,Route} from 'react-router-dom';import Layout from './components/Layout';import Home from './pages/Home';import Stub from './pages/Stub';
export default function App(){return <Routes><Route element={<Layout/>}><Route index element={<Home/>}/>
{['services','about','projects','blog','testimonials','contact'].map(p=><Route key={p} path={p} element={<Stub title={p[0].toUpperCase()+p.slice(1)}/>}/>)}
<Route path="*" element={<Stub title="404 — Page not found"/>}/></Route></Routes>}
