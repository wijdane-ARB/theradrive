import { useState, useEffect, useRef } from "react";
import {
  Calendar, MapPin, ShieldCheck, Car, Clock,
  CheckCircle2, ChevronRight, Menu, X, Star,
  Leaf, Lock, Headphones, Heart, ArrowRight
} from "lucide-react";

// ─── Compteur animé ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += Math.ceil(end / 50);
          if (start >= end) { setCount(end); return; }
          setCount(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Bande défilante (marquee) ────────────────────────────────────────────
function MarqueeStrip() {
  const items = ["Séances confidentielles", "Cabine insonorisée", "Professionnels agréés",
    "Casablanca", "Rabat", "Mohammedia", "Séances de 50 minutes", "Expérience de luxe"];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="dot">◆</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [booking, setBooking] = useState({ city: "", date: "", time: "", service: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submit = (e) => { e.preventDefault(); setStep(2); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --forest: #16302a;
          --forest-mid: #204d3f;
          --forest-light: #2d6654;
          --cream: #faf6ef;
          --cream-dark: #f0ead9;
          --gold: #b89a5e;
          --gold-light: #d4b97a;
          --sage: #7fa98c;
          --white: #ffffff;
          --text-dark: #111d18;
          --text-mid: #3d5248;
          --text-light: #7a9485;
          --radius-xl: 2rem;
          --radius-2xl: 3rem;
          --shadow-soft: 0 20px 60px rgba(22,48,42,0.12);
          --shadow-deep: 0 40px 100px rgba(22,48,42,0.22);
        }

        body { font-family: 'Jost', sans-serif; background: var(--cream); color: var(--text-dark); overflow-x: hidden; }
        h1, h2, h3, .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        ::selection { background: var(--gold-light); color: var(--forest); }

        /* ── Nav ── */
        .nav {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
          padding: 0 2.5rem;
          transition: all .4s ease;
        }
        .nav.scrolled {
          background: rgba(250,246,239,.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(184,154,94,.2);
          box-shadow: 0 4px 30px rgba(22,48,42,.07);
        }
        .nav-inner {
          max-width: 1240px; margin: 0 auto;
          height: 80px; display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: .75rem; text-decoration: none; }
        .logo-icon {
          width: 42px; height: 42px; background: var(--forest);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          color: var(--gold-light); flex-shrink: 0;
        }
        .logo-text { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 700; color: var(--forest); letter-spacing: -.02em; }
        .nav-links { display: flex; align-items: center; gap: 2.5rem; }
        .nav-link { color: var(--text-mid); font-size: .9rem; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; text-decoration: none; transition: color .25s; }
        .nav-link:hover { color: var(--forest); }
        .nav-cta {
          background: var(--forest); color: var(--cream); padding: .65rem 1.6rem;
          border-radius: 100px; font-size: .85rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
          text-decoration: none; border: 1.5px solid var(--forest);
          transition: all .3s; display: flex; align-items: center; gap: .5rem;
        }
        .nav-cta:hover { background: transparent; color: var(--forest); }
        .menu-btn { display: none; background: none; border: none; cursor: pointer; color: var(--forest); }

        /* ── Mobile nav ── */
        .mobile-nav {
          display: none; position: fixed; inset: 0; z-index: 99;
          background: var(--forest); flex-direction: column; align-items: center;
          justify-content: center; gap: 2rem; padding: 2rem;
        }
        .mobile-nav.open { display: flex; }
        .mobile-link { color: var(--cream); font-size: 2rem; font-family: 'Cormorant Garamond', serif; font-weight: 600; text-decoration: none; }
        .mobile-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: var(--cream); cursor: pointer; }

        /* ── Hero ── */
        .hero {
          min-height: 100svh; display: grid; align-items: center;
          padding: 8rem 2.5rem 5rem;
          background: var(--cream);
          position: relative; overflow: hidden;
        }
        .hero-bg-circle {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(45,102,84,.15) 0%, transparent 70%);
        }
        .hero-bg-circle.c1 { width: 700px; height: 700px; top: -200px; right: -200px; }
        .hero-bg-circle.c2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
        .hero-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: .04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        .hero-inner { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; z-index: 1; }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: .6rem;
          padding: .4rem 1rem .4rem .5rem;
          background: var(--forest); color: var(--gold-light);
          border-radius: 100px; font-size: .8rem; font-weight: 500; letter-spacing: .06em; text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .pulse-dot { width: 8px; height: 8px; background: var(--gold-light); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        .hero h1 { font-size: clamp(3.2rem, 6vw, 5.5rem); line-height: 1.05; font-weight: 700; color: var(--forest); margin-bottom: 1.5rem; letter-spacing: -.03em; }
        .hero h1 em { font-style: italic; color: var(--gold); }
        .hero-sub { font-size: 1.05rem; line-height: 1.8; color: var(--text-mid); font-weight: 300; max-width: 440px; margin-bottom: 2.5rem; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: .6rem;
          background: var(--forest); color: var(--cream); padding: 1rem 2rem;
          border-radius: 100px; font-weight: 600; font-size: .95rem; letter-spacing: .02em;
          text-decoration: none; transition: all .3s; border: 2px solid var(--forest);
          box-shadow: 0 8px 30px rgba(22,48,42,.25);
        }
        .btn-primary:hover { background: var(--gold); border-color: var(--gold); color: var(--forest); transform: translateY(-2px); box-shadow: 0 14px 40px rgba(184,154,94,.35); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: .6rem;
          background: transparent; color: var(--forest); padding: 1rem 2rem;
          border-radius: 100px; font-weight: 500; font-size: .95rem;
          text-decoration: none; transition: all .3s; border: 2px solid rgba(22,48,42,.2);
        }
        .btn-secondary:hover { border-color: var(--forest); background: rgba(22,48,42,.05); }

        /* ── Hero visual ── */
        .hero-visual { position: relative; }
        .hero-card {
          background: var(--forest); border-radius: var(--radius-2xl); overflow: hidden;
          aspect-ratio: 4/5; position: relative;
          box-shadow: var(--shadow-deep);
        }
        .hero-card img { width: 100%; height: 100%; object-fit: cover; opacity: .75; mix-blend-mode: luminosity; }
        .hero-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, transparent 40%, rgba(22,48,42,.85) 100%);
        }
        .hero-card-text {
          position: absolute; bottom: 2rem; left: 2rem; right: 2rem; color: var(--cream);
        }
        .hero-card-text .tag { font-size: .75rem; letter-spacing: .1em; text-transform: uppercase; color: var(--gold-light); margin-bottom: .5rem; }
        .hero-card-text h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.8rem; font-weight: 600; line-height: 1.2; }
        .float-badge {
          position: absolute; background: var(--white);
          border-radius: 1rem; padding: .9rem 1.2rem; box-shadow: var(--shadow-soft);
          display: flex; align-items: center; gap: .75rem;
        }
        .float-badge.b1 { top: 2rem; right: -1.5rem; }
        .float-badge.b2 { bottom: 5rem; left: -1.5rem; }
        .float-badge .icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .float-badge .icon.green { background: #e6f4ed; color: #1e7c4b; }
        .float-badge .icon.gold { background: #faf0db; color: var(--gold); }
        .float-badge p { font-size: .7rem; color: var(--text-light); font-weight: 500; letter-spacing: .04em; text-transform: uppercase; }
        .float-badge strong { font-size: .9rem; color: var(--text-dark); font-weight: 600; }
        .accent-line { position: absolute; top: 3rem; right: 3rem; width: 60px; height: 4px; background: var(--gold); border-radius: 2px; }

        /* ── Marquee ── */
        .marquee-wrap { background: var(--forest); overflow: hidden; padding: 1.1rem 0; }
        .marquee-track { display: flex; gap: 0; animation: marquee 28s linear infinite; white-space: nowrap; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-item { color: var(--cream); font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; font-weight: 500; padding: 0 2rem; }
        .dot { color: var(--gold); }

        /* ── Stats ── */
        .stats { background: var(--cream-dark); padding: 4rem 2.5rem; }
        .stats-inner { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(22,48,42,.1); border-radius: 1.5rem; overflow: hidden; }
        .stat-item { background: var(--cream-dark); padding: 2.5rem 2rem; text-align: center; }
        .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 3.5rem; font-weight: 700; color: var(--forest); line-height: 1; }
        .stat-label { font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; color: var(--text-light); margin-top: .4rem; font-weight: 500; }

        /* ── How it works ── */
        .hiw { padding: 7rem 2.5rem; background: var(--white); }
        .hiw-inner { max-width: 1240px; margin: 0 auto; }
        .section-eyebrow { font-size: .75rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 1rem; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 700; color: var(--forest); line-height: 1.15; margin-bottom: 1rem; }
        .section-sub { color: var(--text-mid); font-weight: 300; line-height: 1.8; max-width: 460px; }
        .hiw-grid { margin-top: 4rem; display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .hiw-card {
          background: var(--cream); border-radius: var(--radius-xl); padding: 2.5rem 2rem;
          position: relative; border: 1px solid rgba(22,48,42,.08);
          transition: all .3s ease; overflow: hidden;
        }
        .hiw-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--forest), var(--gold));
          transform: scaleX(0); transform-origin: left; transition: transform .4s ease;
        }
        .hiw-card:hover::before { transform: scaleX(1); }
        .hiw-card:hover { box-shadow: var(--shadow-soft); transform: translateY(-4px); }
        .hiw-num { font-family: 'Cormorant Garamond', serif; font-size: 5rem; font-weight: 700; color: rgba(22,48,42,.06); line-height: 1; position: absolute; top: 1rem; right: 1.5rem; }
        .hiw-icon { width: 56px; height: 56px; background: var(--forest); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: var(--gold-light); margin-bottom: 1.5rem; }
        .hiw-card h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: var(--forest); margin-bottom: .75rem; }
        .hiw-card p { color: var(--text-mid); font-weight: 300; line-height: 1.75; font-size: .95rem; }

        /* ── Benefits ── */
        .benefits { padding: 7rem 2.5rem; background: var(--forest); position: relative; overflow: hidden; }
        .benefits-bg { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(45,102,84,.4) 0%, transparent 70%); right: -200px; top: 50%; transform: translateY(-50%); }
        .benefits-inner { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; position: relative; z-index: 1; }
        .benefits .section-eyebrow { color: var(--gold-light); }
        .benefits .section-title { color: var(--cream); }
        .benefits .section-sub { color: rgba(250,246,239,.6); }
        .benefit-list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 2rem; }
        .benefit-item { display: flex; gap: 1rem; align-items: flex-start; padding: 1.25rem 1.5rem; background: rgba(255,255,255,.05); border-radius: 1rem; border: 1px solid rgba(255,255,255,.08); transition: all .3s; }
        .benefit-item:hover { background: rgba(255,255,255,.09); }
        .benefit-icon { width: 40px; height: 40px; background: rgba(184,154,94,.15); border-radius: .75rem; display: flex; align-items: center; justify-content: center; color: var(--gold-light); flex-shrink: 0; }
        .benefit-text strong { display: block; color: var(--cream); font-size: .95rem; font-weight: 600; margin-bottom: .2rem; }
        .benefit-text span { color: rgba(250,246,239,.55); font-size: .85rem; font-weight: 300; line-height: 1.6; }
        .benefits-img { border-radius: var(--radius-2xl); overflow: hidden; aspect-ratio: 3/4; position: relative; }
        .benefits-img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.8) saturate(.9); }
        .benefits-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(22,48,42,.7) 0%, transparent 50%); }
        .benefits-img-tag { position: absolute; top: 1.5rem; left: 1.5rem; background: var(--gold); color: var(--forest); padding: .4rem 1rem; border-radius: 100px; font-size: .75rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }

        /* ── Testimonials ── */
        .testimonials { padding: 7rem 2.5rem; background: var(--cream); }
        .testimonials-inner { max-width: 1240px; margin: 0 auto; }
        .test-grid { margin-top: 4rem; display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .test-card { background: var(--white); border-radius: var(--radius-xl); padding: 2rem; border: 1px solid rgba(22,48,42,.07); transition: all .3s; }
        .test-card:hover { box-shadow: var(--shadow-soft); transform: translateY(-3px); }
        .test-stars { display: flex; gap: .25rem; color: var(--gold); margin-bottom: 1rem; }
        .test-card blockquote { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-style: italic; color: var(--forest); line-height: 1.6; margin-bottom: 1.5rem; }
        .test-author { display: flex; align-items: center; gap: .75rem; }
        .test-avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--forest-light); display: flex; align-items: center; justify-content: center; color: var(--cream); font-family: 'Cormorant Garamond', serif; font-size: 1.1rem; font-weight: 600; }
        .test-name strong { display: block; font-size: .9rem; font-weight: 600; color: var(--text-dark); }
        .test-name span { font-size: .8rem; color: var(--text-light); }

        /* ── Booking ── */
        .booking-section { padding: 7rem 2.5rem; background: var(--cream-dark); }
        .booking-inner { max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.3fr; gap: 5rem; align-items: start; }
        .booking-aside { position: sticky; top: 6rem; }
        .booking-aside .section-eyebrow { color: var(--gold); }
        .booking-aside .section-title { margin-bottom: 1rem; }
        .booking-aside .section-sub { margin-bottom: 2.5rem; }
        .aside-facts { display: flex; flex-direction: column; gap: .75rem; }
        .aside-fact { display: flex; align-items: center; gap: .75rem; color: var(--text-mid); font-size: .9rem; }
        .aside-fact svg { color: var(--forest); flex-shrink: 0; }

        .booking-form { background: var(--white); border-radius: var(--radius-2xl); padding: 2.5rem; box-shadow: var(--shadow-soft); }
        .form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.7rem; font-weight: 700; color: var(--forest); margin-bottom: .5rem; }
        .form-sub { font-size: .85rem; color: var(--text-light); font-weight: 300; margin-bottom: 2rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-field { display: flex; flex-direction: column; gap: .4rem; }
        .form-field.full { grid-column: 1 / -1; }
        .form-label { font-size: .75rem; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--text-mid); display: flex; align-items: center; gap: .4rem; }
        .form-label svg { color: var(--gold); }
        .form-control {
          background: var(--cream); border: 1.5px solid rgba(22,48,42,.12);
          color: var(--text-dark); padding: .85rem 1.1rem; border-radius: .9rem;
          font-family: 'Jost', sans-serif; font-size: .9rem; font-weight: 400;
          width: 100%; outline: none; transition: all .25s; appearance: none;
        }
        .form-control:focus { border-color: var(--forest); background: var(--white); box-shadow: 0 0 0 3px rgba(22,48,42,.08); }
        .form-divider { height: 1px; background: rgba(22,48,42,.08); margin: 1.5rem 0; grid-column: 1 / -1; }
        .btn-submit {
          width: 100%; background: var(--forest); color: var(--cream);
          padding: 1.1rem 2rem; border-radius: 100px; font-family: 'Jost', sans-serif;
          font-size: .95rem; font-weight: 600; letter-spacing: .04em;
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: .6rem;
          transition: all .3s; box-shadow: 0 8px 30px rgba(22,48,42,.2);
          grid-column: 1 / -1;
        }
        .btn-submit:hover { background: var(--gold); color: var(--forest); transform: translateY(-2px); box-shadow: 0 14px 40px rgba(184,154,94,.3); }
        .form-note { text-align: center; font-size: .75rem; color: var(--text-light); margin-top: .75rem; grid-column: 1 / -1; }

        /* ── Success ── */
        .success-screen { text-align: center; padding: 2rem 0; }
        .success-icon { width: 80px; height: 80px; background: #e8f5ec; color: #2a9d5c; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .success-screen h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--forest); margin-bottom: .75rem; }
        .success-screen p { color: var(--text-mid); font-weight: 300; line-height: 1.8; max-width: 380px; margin: 0 auto 2rem; }
        .btn-link { background: none; border: none; color: var(--forest); font-family: 'Jost', sans-serif; font-weight: 600; font-size: .9rem; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }

        /* ── Footer ── */
        .footer { background: var(--forest); color: rgba(250,246,239,.55); padding: 4rem 2.5rem 2rem; }
        .footer-inner { max-width: 1240px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 3rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,.08); margin-bottom: 2rem; }
        .footer-brand p { font-size: .9rem; font-weight: 300; line-height: 1.8; margin-top: 1rem; max-width: 260px; }
        .footer-col h4 { color: var(--cream); font-size: .8rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 600; margin-bottom: 1rem; }
        .footer-col a { display: block; color: rgba(250,246,239,.55); font-size: .9rem; font-weight: 300; text-decoration: none; margin-bottom: .5rem; transition: color .2s; }
        .footer-col a:hover { color: var(--gold-light); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; font-size: .8rem; }
        .footer-logo-text { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700; color: var(--cream); letter-spacing: -.02em; }
        .gold-bar { display: inline-block; width: 30px; height: 2px; background: var(--gold); margin: 0 .5rem; vertical-align: middle; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .hiw-grid { grid-template-columns: 1fr; }
          .benefits-inner { grid-template-columns: 1fr; }
          .benefits-img { display: none; }
          .test-grid { grid-template-columns: 1fr 1fr; }
          .booking-inner { grid-template-columns: 1fr; }
          .booking-aside { position: static; }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .footer-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .menu-btn { display: block; }
          .hero { padding: 7rem 1.25rem 4rem; }
          .stats-inner { grid-template-columns: 1fr 1fr; }
          .hiw,.benefits,.testimonials,.booking-section,.stats { padding-left: 1.25rem; padding-right: 1.25rem; }
          .test-grid { grid-template-columns: 1fr; }
          .booking-form { padding: 1.75rem; }
          .form-grid { grid-template-columns: 1fr; }
          .footer-top { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
          .float-badge { display: none; }
          .nav { padding: 0 1.25rem; }
        }
      `}</style>

      {/* ── Navigation ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="logo">
            <div className="logo-icon"><Car size={20} /></div>
            <span className="logo-text">TheraDrive</span>
          </a>
          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">Processus</a>
            <a href="#benefits" className="nav-link">Pourquoi nous</a>
            <a href="#testimonials" className="nav-link">Témoignages</a>
            <a href="#booking" className="nav-cta">Réserver <ArrowRight size={14} /></a>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(true)}><Menu size={26} /></button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div className={`mobile-nav${menuOpen ? " open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}><X size={28} /></button>
        {["Processus", "Pourquoi nous", "Témoignages"].map(l => (
          <a key={l} href={`#${l === "Processus" ? "how-it-works" : l === "Pourquoi nous" ? "benefits" : "testimonials"}`}
            className="mobile-link" onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
        <a href="#booking" className="nav-cta" onClick={() => setMenuOpen(false)}>Réserver</a>
      </div>

      {/* ── Héro ── */}
      <section className="hero">
        <div className="hero-bg-circle c1" />
        <div className="hero-bg-circle c2" />
        <div className="hero-grain" />
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="pulse-dot" />
              Maintenant à Casa · Rabat · Mohammedia
            </div>
            <h1>
              Votre esprit<br />mérite un<br /><em>sanctuaire.</em>
            </h1>
            <p className="hero-sub">
              Un salon de thérapie mobile premium qui vient à votre porte. Insonsorisé. Discret. Avec des professionnels agréés — pour que votre bien-être s'adapte à votre vie, et non l'inverse.
            </p>
            <div className="hero-actions">
              <a href="#booking" className="btn-primary">Réserver une séance <ChevronRight size={16} /></a>
              <a href="#how-it-works" className="btn-secondary">Découvrir le fonctionnement</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="accent-line" />
            <div className="hero-card">
              <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80" alt="Intérieur de voiture de luxe" />
              <div className="hero-card-overlay" />
              <div className="hero-card-text">
                <p className="tag">Votre espace privé</p>
                <h3>Un design pensé pour des conversations authentiques</h3>
              </div>
            </div>
            <div className="float-badge b1">
              <div className="icon green"><ShieldCheck size={18} /></div>
              <div>
                <p>Certifié</p>
                <strong>Thérapeutes agréés</strong>
              </div>
            </div>
            <div className="float-badge b2">
              <div className="icon gold"><Headphones size={18} /></div>
              <div>
                <p>Entièrement</p>
                <strong>Cabine insonorisée</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bande défilante ── */}
      <MarqueeStrip />

      {/* ── Chiffres clés ── */}
      <section className="stats">
        <div className="stats-inner">
          {[
            { num: 500, suf: "+", label: "Séances réalisées" },
            { num: 98, suf: "%", label: "Satisfaction client" },
            { num: 12, suf: "", label: "Professionnels agréés" },
            { num: 3, suf: " Villes", label: "et plus" }
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-num"><Counter end={s.num} suffix={s.suf} /></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="how-it-works" className="hiw">
        <div className="hiw-inner">
          <p className="section-eyebrow">Le processus</p>
          <h2 className="section-title">Trois étapes vers<br />votre prochaine séance</h2>
          <div className="hiw-grid">
            {[
              { icon: <Calendar size={24} />, n: "01", title: "Réservez votre créneau", desc: "Choisissez votre ville, date et horaire. Sélectionnez un psychologue clinicien ou un coach exécutif. Pas de liste d'attente." },
              { icon: <Car size={24} />, n: "02", title: "Nous venons à vous", desc: "Notre lounge mobile discret et entièrement équipé arrive à votre domicile, bureau ou tout lieu de votre choix." },
              { icon: <Heart size={24} />, n: "03", title: "Commencez votre cheminement", desc: "Entrez dans la cabine insonorisée pour une séance ininterrompue de 50 minutes avec un professionnel agréé." }
            ].map((s, i) => (
              <div key={i} className="hiw-card">
                <div className="hiw-num">{s.n}</div>
                <div className="hiw-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avantages ── */}
      <section id="benefits" className="benefits">
        <div className="benefits-bg" />
        <div className="benefits-inner">
          <div>
            <p className="section-eyebrow">Pourquoi TheraDrive</p>
            <h2 className="section-title">Bien-être repensé<br />pour la vie moderne</h2>
            <p className="section-sub">Nous avons supprimé chaque barrière entre vous et le soutien que vous méritez. Pas de trajet, pas de stigmatisation, pas de salle d'attente.</p>
            <div className="benefit-list">
              {[
                { icon: <Lock size={18} />, title: "Discrétion absolue", desc: "Votre séance est privée. Nous garantissons l'anonymat à chaque point de contact." },
                { icon: <Headphones size={18} />, title: "Environnement insonorisé", desc: "Cabine acoustiquement isolée — zéro bruit extérieur, zéro interruption." },
                { icon: <ShieldCheck size={18} />, title: "Professionnels agréés uniquement", desc: "Chaque praticien est diplômé, vérifié et supervisé." },
                { icon: <Leaf size={18} />, title: "Pas de salle d'attente", desc: "Fini la culture de la clinique. Votre confort commence dès notre arrivée." }
              ].map((b, i) => (
                <div key={i} className="benefit-item">
                  <div className="benefit-icon">{b.icon}</div>
                  <div className="benefit-text">
                    <strong>{b.title}</strong>
                    <span>{b.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="benefits-img">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=80" alt="Paysage serein" />
            <div className="benefits-img-overlay" />
            <div className="benefits-img-tag">Votre salon privé</div>
          </div>
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section id="testimonials" className="testimonials">
        <div className="testimonials-inner">
          <p className="section-eyebrow">Ils ont retrouvé la paix</p>
          <h2 className="section-title">Leurs histoires</h2>
          <div className="test-grid">
            {[
              { q: "Je n'aurais jamais imaginé que la thérapie puisse être aussi naturelle. Faire ma séance dans la voiture m'a permis de pleurer, de respirer et d'être moi-même sans avoir à jouer un rôle en sortant d'une clinique.", name: "Leila B.", city: "Casablanca", init: "L" },
              { q: "En tant que cadre, j'avais besoin d'une solution adaptée à mes journées chargées. TheraDrive s'est garé devant mon bureau et j'ai eu la séance la plus productive de ma vie en 50 minutes.", name: "Mehdi A.", city: "Rabat", init: "M" },
              { q: "L'insonorisation est extraordinaire. J'avais complètement oublié que j'étais dans un véhicule. C'était comme si une suite de thérapie haut de gamme était venue à moi.", name: "Sara E.", city: "Mohammedia", init: "S" }
            ].map((t, i) => (
              <div key={i} className="test-card">
                <div className="test-stars">{[...Array(5)].map((_,j) => <Star key={j} size={14} fill="currentColor" />)}</div>
                <blockquote>"{t.q}"</blockquote>
                <div className="test-author">
                  <div className="test-avatar">{t.init}</div>
                  <div className="test-name">
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Réservation ── */}
      <section id="booking" className="booking-section">
        <div className="booking-inner">
          <div className="booking-aside">
            <p className="section-eyebrow">Réserver</p>
            <h2 className="section-title">Prêt quand<br />vous l'êtes</h2>
            <p className="section-sub">Aucune pression, aucun engagement tant que nous n'avons pas confirmé. Faites le premier pas — nous nous occupons du reste.</p>
            <div className="aside-facts">
              {[
                [<CheckCircle2 size={16} />, "Paiement uniquement après confirmation"],
                [<CheckCircle2 size={16} />, "Annulation gratuite jusqu'à 24h avant"],
                [<CheckCircle2 size={16} />, "Confidentialité totale garantie"],
                [<CheckCircle2 size={16} />, "Réponse sous 2 heures"]
              ].map(([icon, text], i) => (
                <div key={i} className="aside-fact">{icon} {text}</div>
              ))}
            </div>
          </div>

          <div className="booking-form">
            {step === 1 ? (
              <>
                <h3 className="form-title">Réservez votre séance</h3>
                <p className="form-sub">Indiquez vos préférences, notre concierge vous confirmera sous 2 heures.</p>
                <form onSubmit={submit}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label"><MapPin size={12} /> Ville</label>
                      <select required className="form-control" value={booking.city} onChange={e => setBooking({...booking, city: e.target.value})}>
                        <option value="" disabled>Sélectionnez une ville...</option>
                        <option value="casablanca">Casablanca</option>
                        <option value="rabat">Rabat</option>
                        <option value="mohammedia">Mohammedia</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label"><Star size={12} /> Service</label>
                      <select required className="form-control" value={booking.service} onChange={e => setBooking({...booking, service: e.target.value})}>
                        <option value="" disabled>Sélectionnez un service...</option>
                        <option value="psychologist">Psychologue clinicien</option>
                        <option value="coach">Coach exécutif</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label"><Calendar size={12} /> Date</label>
                      <input type="date" required className="form-control" value={booking.date} onChange={e => setBooking({...booking, date: e.target.value})} />
                    </div>
                    <div className="form-field">
                      <label className="form-label"><Clock size={12} /> Horaire</label>
                      <select required className="form-control" value={booking.time} onChange={e => setBooking({...booking, time: e.target.value})}>
                        <option value="" disabled>Sélectionnez un horaire...</option>
                        <option value="09:00">09:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="16:00">16:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                    <div className="form-divider" />
                    <button type="submit" className="btn-submit">
                      Confirmer la demande <ChevronRight size={16} />
                    </button>
                    <p className="form-note">Vos informations ne sont jamais partagées. Aucune donnée vendue, sous aucun prétexte.</p>
                  </div>
                </form>
              </>
            ) : (
              <div className="success-screen">
                <div className="success-icon"><CheckCircle2 size={40} /></div>
                <h2>Demande envoyée !</h2>
                <p>Votre séance TheraDrive du <strong>{booking.date || "la date choisie"}</strong> à <strong style={{textTransform:"capitalize"}}>{booking.city || "votre ville"}</strong> a bien été reçue. Notre concierge vous appellera sous 2 heures pour confirmer.</p>
                <button className="btn-link" onClick={() => setStep(1)}>← Réserver une autre séance</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Pied de page ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">
                <div className="logo-icon" style={{background:"rgba(255,255,255,.1)", color:"var(--gold-light)"}}><Car size={20} /></div>
                <span className="footer-logo-text">TheraDrive</span>
              </div>
              <p>Soins de santé mentale mobiles premium, délivrés avec discrétion et dignité à travers le Maroc.</p>
            </div>
            <div className="footer-col">
              <h4>Navigation</h4>
              <a href="#how-it-works">Le processus</a>
              <a href="#benefits">Pourquoi nous</a>
              <a href="#testimonials">Témoignages</a>
              <a href="#booking">Réserver</a>
            </div>
            <div className="footer-col">
              <h4>Légal</h4>
              <a href="#">Confidentialité</a>
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Cookies</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 TheraDrive Maroc<span className="gold-bar" />Tous droits réservés.</span>
            <span>Casablanca <span className="gold-bar" /> Rabat <span className="gold-bar" /> Mohammedia</span>
          </div>
        </div>
      </footer>
    </>
  );
}