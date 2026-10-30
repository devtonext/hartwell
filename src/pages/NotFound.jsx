import {PillBtn} from '../components/ui';import {usePageTitle} from '../components/PageHero';
export default function NotFound(){usePageTitle('Page not found');return <section className="wrap sec center"><h1 style={{fontSize:80,margin:0}}>404</h1><h2>Page not found</h2><p className="muted">The page you’re looking for doesn’t exist.</p><PillBtn to="/">Back to Home</PillBtn></section>}
