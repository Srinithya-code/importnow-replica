import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import data from './content.json';
import { Globe, Journey } from './scenes';
import { CoverIcon } from './cover-icons';
import './style.css';

const phone = '919989724320';
const wa = 'https://wa.me/' + phone;
const instagram = 'https://www.instagram.com/importnow.in/';
const { headings, services, products, posts } = data;
const path = location.pathname;
const blog = /\/blog(?:\.html)?\/?$/.test(path);
const home = !blog && !path.endsWith('/post.html');
const anchor = (id) => (home ? '#' : 'index.html#') + id;
const postLink = (post) => 'post.html?p=' + encodeURIComponent(post.slug);
const nav = [['Services', 'services'], ['How it works', 'journey'], ['What we import', 'products'], ['China trips', 'trips'], ['Blog', 'blog'], ['Contact', 'contact']];
const date = (value) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));

function Flag({ country }) {
  return country === 'cn'
    ? <svg className="flag" viewBox="0 0 27 18" aria-hidden="true"><rect width="27" height="18" rx="1" fill="#de2910"/><text x="2" y="8" fontSize="7" fill="#ffde00">★</text><path d="M9 2h1m1 2h1m0 3h1m-3 2h1" stroke="#ffde00"/></svg>
    : <svg className="flag" viewBox="0 0 27 18" aria-hidden="true"><path fill="#ff9933" d="M0 0h27v6H0z"/><path fill="#fff" d="M0 6h27v6H0z"/><path fill="#138808" d="M0 12h27v6H0z"/><circle cx="13.5" cy="9" r="2.3" fill="none" stroke="#000080"/><path stroke="#000080" strokeWidth=".5" d="M13.5 6.7v4.6m-2.3-2.3h4.6m-3.9-1.6 3.2 3.2m0-3.2-3.2 3.2"/></svg>;
}

function Icon({ name }) {
  const shapes = {
    menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
    ship: <path d="M3 16h18l-2 5H5zM6 16v-5h12v5M9 11V7h6v4m-3-4V3M2 21c2 0 2 1 4 1s2-1 4-1 2 1 4 1 2-1 4-1 2 1 4 1"/>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4c0 1-1 2-2 2C10 21 3 14 3 6c0-1 1-2 2-2Z"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.1"/></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1114 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    wa: <><path d="M5 19 3 21l1-5a9 9 0 117 5 10 10 0 01-6-2Z"/><path d="M8 7c-2 1 1 8 6 9 1 .2 2-.5 2-1.5l-3-1.5-1 1c-1.6-.8-2.4-1.6-3-3l1-1-1.4-3Z"/></>,
    tick: <path d="m5 12 5 5 9-10"/>,
  };
  return <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name] || shapes.tick}</svg>;
}

function Logo() {
  return <a href={anchor('home')} aria-label="ImportNow home" className="wordmark">IMP<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 3.1A9.5 9.5 0 1 0 15.8 3.1" fill="none" stroke="currentColor" strokeWidth="3.6"/><path d="M12 1.5v10.2M7.6 8l4.4 4.6L16.4 8" fill="none" stroke="currentColor" strokeWidth="3.2"/></svg>RTNOW</a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  useEffect(() => {
    const sections = home ? [...document.querySelectorAll('main > section[id]')] : [];
    const update = () => {
      setProgress(Math.max(0, Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))));
      if (!home) return;
      const active = sections.find(section => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= 100 && bottom > 100;
      });
      setActiveSection(active?.id ?? '');
    };
    const escape = (event) => { if (event.key === 'Escape') setOpen(false); };
    update();
    addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(document.body);
    addEventListener('keydown', escape);
    return () => { removeEventListener('scroll', update); removeEventListener('keydown', escape); resize.disconnect(); };
  }, []);
  return <header className={'header' + (progress > 0.002 ? ' scrolled' : '')}>
    <div className="reading-progress" style={{ transform: 'scaleX(' + progress + ')' }}/>
    <div className="wrap nav-inner">
      <Logo/>
      <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></button>
      <nav aria-label="Main navigation" id="main-menu" className={open ? 'open' : ''}>
        {nav.map(([name, id]) => <a key={id} href={id === 'blog' ? '/blog' : anchor(id)} aria-current={id === 'blog' && !home ? 'page' : id === activeSection ? 'location' : undefined} onClick={() => setOpen(false)}>{name}</a>)}
      </nav>
      <a className="button primary nav-quote" href={anchor('contact')}>Get a free quote</a>
    </div>
  </header>;
}

function Headline({ level: Tag = 'h2', title, accent, ending, className = '' }) {
  const heading = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0, rootMargin: '-72px 0px -24px' });
    observer.observe(heading.current);
    return () => observer.disconnect();
  }, []);

  let index = 0;
  const words = (text) => text.split(/(\s+)/).map((part, i) => {
    if (!part || /^\s+$/.test(part)) return part;
    return <span className="headline-word" key={i}><span style={{ '--word-delay': 60 + 55 * index++ + 'ms' }}>{part}</span></span>;
  });

  return <Tag ref={heading} className={['headline', className, inView ? 'headline-in' : ''].filter(Boolean).join(' ')}>
    {words(title)}{accent && <> <em>{words(accent)}</em></>}{ending && <> {words(ending)}</>}
  </Tag>;
}

function Heading({ id, level = 'h2', description = true }) {
  const { label, title, red, description: copy } = headings[id];
  return <>{label && <span className="eyebrow">{label}</span>}<Headline level={level} title={title} accent={red}/>{description && copy && <p className="section-intro">{copy}</p>}</>;
}

function Section({ id, children, short }) {
  return <section id={id} className={'section' + (short ? ' short' : '')}><div className="wrap"><div className="section-heading"><Heading id={id}/></div>{children}</div></section>;
}

function Count({ value, suffix }) {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setNumber(value);
      return;
    }
    let frame;
    const start = performance.now() + 280;
    function tick(now) {
      const progress = Math.max(0, Math.min(1, (now - start) / 1100));
      setNumber(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{number}{suffix}</>;
}

function RoutesMarquee() {
  const routes = [['Yiwu', 'Adilabad'], ['Foshan', 'Hyderabad'], ['Shenzhen', 'Siddipet'], ['Guangzhou', 'Chennai'], ['Shanghai', 'Nhava Sheva'], ['Guzhen', 'Vizag'], ['Ningbo', 'Mumbai']];
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">{[0, 1].map(copy => <div key={copy}>{routes.map(([from, to]) => <span key={from}>{from} <em>→</em> {to}</span>)}</div>)}</div></div>;
}

function Hero() {
  return <section id="home" className="hero">
    <Globe Flag={Flag}/>
    <div className="wrap hero-wrap"><div className="hero-copy">
      <span className="trust"><Flag country="cn"/><span>→</span><Flag country="in"/> Trusted by 500+ Indian businesses</span>
      <Heading id="home" level="h1"/>
      <div className="flex flex-wrap gap-3 hero-actions"><a className="button primary" href="#contact">Get a free sourcing quote →</a><a className="button secondary" href="#journey">See how it works</a></div>
      <div className="hero-stats grid grid-cols-2 sm:grid-cols-4">{[[<Count value={500} suffix="+"/>, 'Businesses served'], [<Count value={83} suffix="K+"/>, 'Community on Instagram'], ['1 pc', 'MOQ on many products'], ['Shanghai', 'Own registered company']].map(([num, label]) => <div key={label}><strong>{num}</strong><small>{label}</small></div>)}</div>
    </div></div>
    <div className="scroll-cue" aria-hidden="true">Scroll<i/></div>
  </section>;
}

function Services() {
  return <Section id="services"><div className="cards three">{services.map(({ title, description, asset }, i) =>
    <article className="card lift" key={title}><span className="card-num">{String(i + 1).padStart(2, '0')}</span><div className="service-icon">{asset ? <img alt="" src={asset}/> : <Icon name="ship"/>}</div><h3>{title}</h3><p>{description}</p></article>
  )}</div></Section>;
}

function Products() {
  return <Section id="products"><div className="cards three">{products.map(({ title, hub, items, note, asset }, i) =>
    <article className={'card product lift palette-' + i} key={title}><img className="product-art" alt="" src={asset}/><div className="hub"><Flag country="cn"/>{hub}</div><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul><small>{note}</small></article>
  )}</div></Section>;
}

const licenceBenefits = ['Registered business licence', 'Chinese company bank account', 'Team on the ground', 'Indian founder on both sides'];
const company = 'Shanghai Shengqiao Chain Trading Co., Ltd.';

function Shanghai() {
  const copy = headings.shanghai.description;
  const companyStart = copy.indexOf(company);
  return <section id="shanghai" className="section dark">
    <div className="wrap shanghai-grid">
      <div>
        <Heading id="shanghai" description={false}/>
        <p className="section-intro">{copy.slice(0, companyStart)}<b>{company}</b>{copy.slice(companyStart + company.length)}</p>
        <ul className="checks">{data.checks.map((item, index) => {
          const lead = licenceBenefits[index];
          return <li key={item}><span><Icon name="tick"/></span><div><b>{lead}</b>{item.slice(lead.length)}</div></li>;
        })}</ul>
      </div>
      <div className="licence-stage">
        <div className="licence">
          <div className="licence-title" lang="zh">营业执照</div>
          <div className="licence-sub">BUSINESS LICENCE</div>
          <div className="licence-emblem" aria-hidden="true"/>
          <dl>{data.licence.map(([label, value]) => <React.Fragment key={label}><dt>{label}</dt><dd>{value}</dd></React.Fragment>)}</dl>
          <div className="licence-checker" aria-hidden="true"/>
          <span className="stamp"><span>SHANGHAI<br/>SHENGQIAO<br/>TRADING</span></span>
        </div>
      </div>
    </div>
  </section>;
}

function Trips() {
  const { title, description, destinations, asset } = data.trip;
  return <Section id="trips"><div className="trip-grid">
    <article className="card trip-first"><img alt="" src={asset}/><div><span className="eyebrow">Canton Fair · Guangzhou</span><h3>{title}</h3><p>{description}</p><div className="pills">{destinations.map((name) => <span key={name}>{name}</span>)}</div></div></article>
    <article className="card"><h3>What's included</h3><ul className="included">{data.includes.map((item) => <li key={item}><Icon name="tick"/>{item}</li>)}</ul></article>
    <article className="card"><h3>Next departures</h3><div className="dates"><div><b>Spring</b><span>Canton Fair · April–May</span></div><div><b>Autumn</b><span>Canton Fair · October–November</span></div></div><a className="button primary" href="#contact">Join the next trip →</a></article>
  </div></Section>;
}

function Work() {
  return <Section id="work" short><div className="cards four">{data.work.map(({ route, title, asset, description, tags }, i) => <article className="card work lift" key={title}><div className={'work-art palette-' + i}><img alt="" src={asset}/><span>{route}</span></div><div className="work-copy"><h3>{title}</h3><p>{description}</p><div className="pills">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div></Section>;
}

function Stories() {
  return <Section id="stories" short><div className="cards three">{data.stories.map(({ quote, name, initial, role }) => <figure className="card story" key={quote}><blockquote>{quote}</blockquote><figcaption><span className="avatar">{initial || name.slice(0, 1)}</span><div><b>{name}</b><small>{role}</small></div></figcaption></figure>)}</div></Section>;
}

function PostCard({ post }) {
  const card = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: .08 });
    observer.observe(card.current);
    return () => observer.disconnect();
  }, []);

  const href = postLink(post);
  return <article className={revealed ? 'post-card revealed' : 'post-card'} ref={card}>
    <a className="post-cover" href={href} aria-label={post.title}>
      <span className={'cover-gradient ' + post.cv}/>
      <CoverIcon name={post.icon}/>
      <span className="cover-category">{post.cat}</span>
      <span className="cover-flags" aria-hidden="true"><Flag country="cn"/>→<Flag country="in"/></span>
      <strong className="cover-title">{post.bannerTitle || post.title}</strong>
    </a>
    <div className="post-copy">
      <h3><a href={href}>{post.title}</a></h3>
      <div className="post-meta"><time dateTime={post.date}>{date(post.date)}</time><span aria-hidden="true">·</span>{post.mins} min read</div>
      <p>{post.excerpt}</p>
      <a className="read-more" href={href}>Read more <span aria-hidden="true">→</span></a>
    </div>
  </article>;
}

function Guides() {
  return <section className="section short" id="guides"><div className="wrap"><div className="guide-heading"><div className="section-heading"><Heading id="guides"/></div><a href="/blog" className="button secondary">View all articles →</a></div><div className="cards three">{posts.slice(0, 3).map(post => <PostCard post={post} key={post.slug}/>)}</div></div></section>;
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return <Section id="faq" short><div className="faq">{data.faq.map(([question, answer], i) => <div key={question}><h3><button aria-expanded={open === i} aria-controls={'faq-' + i} onClick={() => setOpen(open === i ? -1 : i)}>{question}<span aria-hidden="true">{open === i ? '−' : '+'}</span></button></h3><p hidden={open !== i} id={'faq-' + i}>{answer}</p></div>)}</div></Section>;
}

function Field({ label, name, options, placeholder, required, multiline }) {
  return <label className="field">{label}{options ? <select name={name}>{options.map(option => <option key={option}>{option}</option>)}</select> : multiline ? <textarea name={name} placeholder={placeholder}/> : <input name={name} placeholder={placeholder} required={required}/>}</label>;
}

function Contact() {
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = ['Hello ImportNow! I would like a free sourcing quote.', ...[...form].filter(([, value]) => value.trim()).map(([label, value]) => label + ': ' + value.trim())].join('\n');
    window.open(wa + '?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  }
  const details = [['phone', 'Call or WhatsApp', '+91 99897 24320', 'tel:+' + phone], ['instagram', 'Instagram', '@importnow.in', instagram], ['pin', 'Offices', 'Hyderabad, India · Shanghai, China', '']];
  return <section id="contact" className="section contact"><div className="wrap split">
    <div><Heading id="contact"/><div className="contact-lines">{details.map(([icon, label, value, href]) => {
      const content = <><Icon name={icon}/><div><small>{label}</small><b>{value}</b></div></>;
      return href ? <a className="contact-line" key={label} href={href} target={icon === 'instagram' ? '_blank' : undefined} rel="noopener noreferrer">{content}</a> : <div className="contact-line" key={label}>{content}</div>;
    })}</div></div>
    <form className="card quote-form" onSubmit={submit}><h3>Get a free sourcing quote</h3>
      <div className="form-row"><Field label="Your name" name="Name" placeholder="Full name" required/><Field label="City" name="City" placeholder="e.g. Hyderabad"/></div>
      <Field label="What do you want to import?" name="Category" options={data.categories}/>
      <div className="form-row"><Field label="Approx. quantity" name="Quantity" placeholder="e.g. 1 container"/><Field label="Budget" name="Budget" options={data.budget}/></div>
      <Field label="Details" name="Details" placeholder="Product, specs, reference photos or links…" multiline/>
      <button className="button primary" type="submit">Send on WhatsApp →</button><small>Opens WhatsApp with your details filled in. We usually reply within a few hours.</small>
    </form>
  </div></section>;
}

function Footer() {
  return <footer><div className="wrap"><div className="footer-grid">
    <div><Logo/><p>End-to-end imports from China to India: sourcing, factory inspection, shipping and customs. Save time. Reduce costs.</p><div className="socials"><a href={instagram} aria-label="Instagram"><Icon name="instagram"/></a><a href={wa} aria-label="WhatsApp"><Icon name="wa"/></a><a href={'tel:+' + phone} aria-label="Call"><Icon name="phone"/></a></div></div>
    <div><h4>Our services</h4><ul>{services.map(({ title }) => <li key={title}><a href={anchor('services')}>{title}</a></li>)}</ul></div>
    <div><h4>What we import</h4><ul>{products.slice(0, 5).map(({ title }, index) => <li key={title}><a href={anchor('products')}>{index === 4 ? 'Supermarket goods' : title}</a></li>)}<li><a href={anchor('trips')}>Canton Fair trips</a></li></ul></div>
    <div><h4>Import guides</h4><ul>{posts.slice(0, 5).map(post => <li key={post.slug}><a href={postLink(post)}>{post.title}</a></li>)}<li><a href="/blog">All articles →</a></li></ul></div>
    <div><h4>Get in touch</h4><ul><li>Call / WhatsApp<br/><a href={'tel:+' + phone}>+91 99897 24320</a></li><li>India<br/>Hyderabad, Telangana</li><li>China<br/>Shanghai Shengqiao Chain Trading Co., Ltd., Shanghai</li><li>Instagram<br/><a href={instagram}>@importnow.in</a></li></ul></div>
  </div><div className="copyright">© 2026 ImportNow.in · All rights reserved. <span>Concept design · preview prepared for ImportNow</span></div></div></footer>;
}

function Blog() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const categories = ['All', ...new Set(posts.map(post => post.cat))];
  const matches = posts.filter(post => (category === 'All' || category === post.cat) && (post.title + ' ' + post.excerpt).toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.ceil(matches.length / 6);
  return <main className="wrap blog"><div className="breadcrumb"><a href="index.html">Home</a> / Blog</div><Headline level="h1" title="Import Guides" accent="&amp;" ending="Blogs"/><p className="section-intro">Everything we've learned from hundreds of shipments: sourcing in China, choosing markets, shipping, customs and business ideas for India.</p><div className="filters"><div>{categories.map(item => <button className={item === category ? 'active' : ''} key={item} type="button" aria-pressed={item === category} onClick={() => { setCategory(item); setPage(1); }}>{item}</button>)}</div><input type="search" aria-label="Search articles" placeholder="Search articles…" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }}/></div><div className="cards blog-grid">{matches.slice((page - 1) * 6, page * 6).map(post => <PostCard post={post} key={post.slug}/>)}</div>{matches.length === 0 && <p className="no-results">No articles found.</p>}{pages > 1 && <div className="pagination">{Array.from({ length: pages }, (_, i) => <button key={i} aria-label={'Page ' + (i+1)} aria-current={page === i + 1 ? 'page' : undefined} className={page === i + 1 ? 'active' : ''} onClick={() => { setPage(i + 1); document.querySelector('.filters').scrollIntoView({ block: 'center' }); }}>{i + 1}</button>)}</div>}</main>;
}

function Article() {
  const post = posts.find(item => item.slug === new URLSearchParams(location.search).get('p'));
  if (!post) return <main className="wrap blog"><h1>Article not found</h1><a href="/blog">Back to blog</a></main>;
  return <main className="wrap article-page"><div className="breadcrumb"><a href="index.html">Home</a> / <a href="/blog">Blog</a> / {post.cat}</div><span className="eyebrow">{post.cat}</span><Headline level="h1" title={post.title}/><div className="post-meta">{date(post.date)} · {post.mins} min read</div><p className="section-intro">{post.excerpt}</p><article className="article-body" dangerouslySetInnerHTML={{ __html: post.body }}/><a className="button primary" href={anchor('contact')}>Get a free sourcing quote</a><Headline className="related-title" title="Related articles"/><div className="cards three">{posts.filter(item => item !== post).sort((a, b) => Number(b.cat === post.cat) - Number(a.cat === post.cat)).slice(0, 3).map(item => <PostCard key={item.slug} post={item}/>)}</div></main>;
}

function App() {
  useEffect(() => {
    if (blog) document.title = "Import Guides & Blogs | ImportNow";
    if (home && location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  }, []);
  return <><Header/>{home ? <main><Hero/><RoutesMarquee/><Services/><Journey Heading={Heading} Flag={Flag} Icon={Icon} steps={data.journey}/><Products/><Shanghai/><Trips/><Work/><Stories/><Guides/><FAQ/><Contact/></main> : blog ? <Blog/> : <Article/>}<Footer/><a className="whatsapp" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><Icon name="wa"/></a></>;
}

createRoot(document.getElementById('root')).render(<App/>);


