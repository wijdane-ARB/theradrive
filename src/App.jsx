import { useState, useEffect, useRef } from "react";
import {
  Calendar, MapPin, ShieldCheck, Car, Clock,
  CheckCircle2, ChevronRight, Menu, X, Star,
  Leaf, Lock, Headphones, Heart, ArrowRight,
  Briefcase, CalendarClock, Gem, Sparkles, PhoneCall, Building2, User, Phone,
  Quote, Award, Zap, ChevronDown
} from "lucide-react";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Counter({ end, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += Math.ceil(end / 60);
          if (start >= end) { setCount(end); return; }
          setCount(start); requestAnimationFrame(step);
        };
        requestAnimationFrame(step); obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function AnimatedSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
    }}>
      {children}
    </div>
  );
}

function MarqueeStrip() {
  const items = ["Séances confidentielles", "Cabine insonorisée", "Professionnels agréés",
    "Casablanca", "Rabat", "Marrakech", "50 minutes de présence totale", "Expérience de luxe", "Zéro salle d'attente"];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot">◆</span> {item}
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
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [booking, setBooking] = useState({ name: "", phone: "", city: "", date: "", time: "", service: "" });

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const submit = (e) => { e.preventDefault(); setStep(2); };
  const selectTherapy = () => { setBooking(p => ({ ...p, service: "psychologist" })); document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); };
  const selectCoach = () => { setBooking(p => ({ ...p, service: "coach" })); document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); };
  const handleContactSubscription = () => { alert("Notre équipe vous contactera sous 24h pour personnaliser votre offre VIP."); };
  const handleContactCorporate = () => { alert("Notre équipe dédiée vous recontactera sous 24h pour organiser votre journée sur-mesure."); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        :root {
          --ink: #0e1c17;
          --ink-mid: #1a3028;
          --ink-soft: #2b4a3c;
          --moss: #3d6b58;
          --sage: #6fa08a;
          --sage-light: #a8cbbf;
          --parchment: #f8f3ea;
          --parchment-dark: #ede5d3;
          --parchment-deep: #e2d8c4;
          --gold: #c4a35a;
          --gold-light: #dbbf7c;
          --gold-pale: #f0e4c3;
          --white: #ffffff;
          --text-dark: #0e1c17;
          --text-mid: #3a5448;
          --text-soft: #7a9486;
          --text-faint: #a8bfb7;
          --r-sm: .75rem;
          --r-md: 1.25rem;
          --r-lg: 2rem;
          --r-xl: 3rem;
          --shadow-sm: 0 4px 16px rgba(14,28,23,.08);
          --shadow-md: 0 12px 40px rgba(14,28,23,.12);
          --shadow-lg: 0 32px 80px rgba(14,28,23,.18);
          --shadow-xl: 0 48px 120px rgba(14,28,23,.24);
        }

        body { font-family: 'DM Sans', sans-serif; background: var(--parchment); color: var(--text-dark); overflow-x: hidden; }
        h1,h2,h3,h4,.serif { font-family: 'Playfair Display', Georgia, serif; }
        ::selection { background: var(--gold-pale); color: var(--ink); }

        /* ─── Scrollbar ─── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--parchment); }
        ::-webkit-scrollbar-thumb { background: var(--sage); border-radius: 3px; }

        /* ─── Nav ─── */
        .nav {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 200;
          padding: 0 3rem; transition: all .5s cubic-bezier(0.16,1,0.3,1);
        }
        .nav.scrolled {
          background: rgba(248,243,234,.94);
          backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid rgba(196,163,90,.15);
          box-shadow: 0 2px 24px rgba(14,28,23,.06);
        }
        .nav-inner { max-width: 1280px; margin: 0 auto; height: 84px; display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: .875rem; text-decoration: none; }
        .logo-icon {
          width: 44px; height: 44px; background: var(--ink); border-radius: 14px;
          display: flex; align-items: center; justify-content: center; color: var(--gold-light);
          transition: transform .3s; flex-shrink: 0;
        }
        .logo:hover .logo-icon { transform: rotate(-6deg) scale(1.05); }
        .logo-wordmark { display: flex; flex-direction: column; line-height: 1; }
        .logo-name { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--ink); letter-spacing: -.03em; }
        .logo-tagline { font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; color: var(--text-soft); margin-top: 2px; }
        .nav-links { display: flex; align-items: center; gap: 2.5rem; }
        .nav-link { color: var(--text-mid); font-size: .82rem; font-weight: 500; letter-spacing: .05em; text-transform: uppercase; text-decoration: none; transition: color .25s; position: relative; padding-bottom: 2px; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 100%; height: 1px; background: var(--gold); transition: right .3s; }
        .nav-link:hover { color: var(--ink); }
        .nav-link:hover::after { right: 0; }
        .nav-cta {
          background: var(--ink); color: var(--gold-light); padding: .7rem 1.75rem;
          border-radius: 100px; font-size: .8rem; font-weight: 600; letter-spacing: .07em; text-transform: uppercase;
          text-decoration: none; border: 1.5px solid var(--ink); transition: all .3s;
          display: flex; align-items: center; gap: .5rem;
        }
        .nav-cta:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }
        .menu-btn { display: none; background: none; border: none; cursor: pointer; color: var(--ink); }

        /* ─── Mobile nav ─── */
        .mobile-nav {
          display: none; position: fixed; inset: 0; z-index: 199;
          background: var(--ink); flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
        }
        .mobile-nav.open { display: flex; }
        .mobile-link { color: var(--parchment); font-size: 2.2rem; font-family: 'Playfair Display', serif; font-style: italic; text-decoration: none; transition: color .2s; }
        .mobile-link:hover { color: var(--gold-light); }
        .mobile-close { position: absolute; top: 1.75rem; right: 1.75rem; background: none; border: none; color: var(--parchment); cursor: pointer; opacity: .7; }

        /* ─── Hero ─── */
        .hero { min-height: 100svh; position: relative; overflow: hidden; display: grid; align-items: center; }
        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, var(--parchment) 0%, var(--parchment-dark) 50%, #d9cfb8 100%);
        }
        .hero-orb {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(61,107,88,.18) 0%, transparent 70%);
        }
        .hero-orb.o1 { width: 900px; height: 900px; top: -300px; right: -250px; animation: orb-drift 18s ease-in-out infinite alternate; }
        .hero-orb.o2 { width: 500px; height: 500px; bottom: -150px; left: -150px; animation: orb-drift 24s ease-in-out infinite alternate-reverse; }
        .hero-orb.o3 { width: 300px; height: 300px; top: 30%; left: 20%; animation: orb-drift 30s ease-in-out infinite; }
        @keyframes orb-drift { from{transform:translate(0,0)} to{transform:translate(30px,40px)} }

        .hero-noise {
          position: absolute; inset: 0; pointer-events: none; opacity: .03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }
        .hero-grid-lines {
          position: absolute; inset: 0; pointer-events: none; opacity: .045;
          background-image: linear-gradient(var(--ink) 1px, transparent 1px),
            linear-gradient(90deg, var(--ink) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }
        .hero-inner {
          max-width: 1280px; margin: 0 auto; padding: 8rem 3rem 5rem;
          display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; position: relative; z-index: 1;
        }
        .hero-left {}
        .hero-badge {
          display: inline-flex; align-items: center; gap: .6rem; margin-bottom: 2rem;
          border: 1px solid rgba(196,163,90,.3); background: rgba(196,163,90,.08);
          border-radius: 100px; padding: .45rem 1.2rem .45rem .6rem;
        }
        .hero-badge-dot { width: 8px; height: 8px; background: var(--gold); border-radius: 50%; animation: pulse 2.4s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.7)} }
        .hero-badge-text { font-size: .72rem; font-weight: 500; letter-spacing: .07em; text-transform: uppercase; color: var(--gold); }

        .hero h1 {
          font-size: clamp(3.4rem, 6.5vw, 6rem); line-height: 1.03; font-weight: 700;
          color: var(--ink); letter-spacing: -.04em; margin-bottom: 1.75rem;
        }
        .hero h1 .line { display: block; overflow: hidden; }
        .hero h1 .word {
          display: inline-block;
          transform: ${heroLoaded ? "translateY(0)" : "translateY(110%)"};
          opacity: ${heroLoaded ? 1 : 0};
          transition: transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease;
        }
        .hero h1 .w1 { transition-delay: 0ms; }
        .hero h1 .w2 { transition-delay: 120ms; }
        .hero h1 .w3 { transition-delay: 240ms; }
        .hero h1 .w4 { transition-delay: 360ms; }
        .hero h1 .w5 { transition-delay: 480ms; }
        .hero h1 em { font-style: italic; color: var(--gold); font-weight: 600; }

        .hero-desc {
          font-size: 1.05rem; line-height: 1.85; color: var(--text-mid); font-weight: 300; max-width: 460px; margin-bottom: 2.75rem;
          opacity: ${heroLoaded ? 1 : 0};
          transform: ${heroLoaded ? "translateY(0)" : "translateY(16px)"};
          transition: opacity .9s ease 600ms, transform .9s cubic-bezier(0.16,1,0.3,1) 600ms;
        }
        .hero-actions {
          display: flex; gap: 1.25rem; flex-wrap: wrap;
          opacity: ${heroLoaded ? 1 : 0};
          transform: ${heroLoaded ? "translateY(0)" : "translateY(16px)"};
          transition: opacity .9s ease 750ms, transform .9s cubic-bezier(0.16,1,0.3,1) 750ms;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: .65rem;
          background: var(--ink); color: var(--gold-light); padding: 1.05rem 2.25rem;
          border-radius: 100px; font-weight: 600; font-size: .9rem; letter-spacing: .02em;
          text-decoration: none; transition: all .35s cubic-bezier(0.16,1,0.3,1);
          border: 2px solid var(--ink); box-shadow: 0 8px 32px rgba(14,28,23,.22);
        }
        .btn-primary:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); transform: translateY(-3px); box-shadow: 0 18px 48px rgba(196,163,90,.3); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: .65rem;
          background: transparent; color: var(--ink); padding: 1.05rem 2.25rem;
          border-radius: 100px; font-weight: 500; font-size: .9rem;
          text-decoration: none; transition: all .3s; border: 2px solid rgba(14,28,23,.15);
        }
        .btn-secondary:hover { border-color: var(--ink); background: rgba(14,28,23,.05); transform: translateY(-2px); }

        /* ─── Hero visual ─── */
        .hero-visual {
          position: relative;
          opacity: ${heroLoaded ? 1 : 0};
          transform: ${heroLoaded ? "translateX(0) scale(1)" : "translateX(40px) scale(.95)"};
          transition: opacity 1.2s ease 300ms, transform 1.2s cubic-bezier(0.16,1,0.3,1) 300ms;
        }
        .hero-frame {
          background: var(--ink); border-radius: var(--r-xl); overflow: hidden;
          aspect-ratio: 4/5; position: relative; box-shadow: var(--shadow-xl);
        }
        .hero-frame::before {
          content: ''; position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(160deg, rgba(196,163,90,.12) 0%, transparent 40%, rgba(14,28,23,.8) 100%);
        }
        .hero-frame img { width: 100%; height: 100%; object-fit: cover; opacity: .7; filter: saturate(.9); display: block; }
        .hero-frame-caption { position: absolute; bottom: 2.25rem; left: 2.25rem; right: 2.25rem; z-index: 3; }
        .hero-frame-caption .tag { font-size: .68rem; letter-spacing: .12em; text-transform: uppercase; color: var(--gold-light); margin-bottom: .6rem; }
        .hero-frame-caption h3 { font-family: 'Playfair Display', serif; font-size: 1.65rem; font-weight: 600; color: #fff; line-height: 1.25; }
        .hero-corner-accent { position: absolute; top: 2rem; right: 2rem; z-index: 3; }
        .hero-corner-accent svg { color: var(--gold); opacity: .7; }

        .hero-pill {
          position: absolute; background: var(--white); border-radius: 1.25rem;
          padding: 1rem 1.4rem; box-shadow: var(--shadow-md);
          display: flex; align-items: center; gap: .875rem; z-index: 4;
        }
        .hero-pill.p1 { top: 2.25rem; right: -1.75rem; }
        .hero-pill.p2 { bottom: 5.5rem; left: -1.75rem; }
        .pill-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pill-icon.green { background: #e4f2eb; color: #1d7a4a; }
        .pill-icon.gold { background: var(--gold-pale); color: var(--gold); }
        .pill-label { font-size: .65rem; color: var(--text-faint); font-weight: 500; letter-spacing: .05em; text-transform: uppercase; }
        .pill-value { font-size: .88rem; color: var(--text-dark); font-weight: 600; }

        .hero-line-deco { position: absolute; top: 3.5rem; right: 3.5rem; width: 48px; z-index: 3; }
        .hero-line-deco span { display: block; height: 2px; background: var(--gold); border-radius: 1px; margin-bottom: 5px; }
        .hero-line-deco span:nth-child(2) { width: 70%; opacity: .6; }

        /* ─── Marquee ─── */
        .marquee-wrap { background: var(--ink); overflow: hidden; padding: 1.2rem 0; position: relative; }
        .marquee-wrap::before, .marquee-wrap::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 1; }
        .marquee-wrap::before { left: 0; background: linear-gradient(90deg, var(--ink), transparent); }
        .marquee-wrap::after { right: 0; background: linear-gradient(-90deg, var(--ink), transparent); }
        .marquee-track { display: flex; animation: marquee 32s linear infinite; white-space: nowrap; }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-item { color: rgba(248,243,234,.7); font-size: .73rem; letter-spacing: .1em; text-transform: uppercase; font-weight: 500; padding: 0 2.5rem; }
        .marquee-dot { color: var(--gold); margin-right: .25rem; }

        /* ─── Stats ─── */
        .stats { background: var(--ink); padding: 0; }
        .stats-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); }
        .stat-item {
          padding: 3.5rem 2.5rem; text-align: center; border-right: 1px solid rgba(255,255,255,.07);
          position: relative; overflow: hidden;
          transition: background .3s;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(255,255,255,.03); }
        .stat-item::before { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 2px; background: var(--gold); transition: width .4s; }
        .stat-item:hover::before { width: 40%; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 3.8rem; font-weight: 700; color: var(--parchment); line-height: 1; letter-spacing: -.03em; }
        .stat-label { font-size: .73rem; letter-spacing: .1em; text-transform: uppercase; color: rgba(248,243,234,.4); margin-top: .6rem; font-weight: 500; }
        .stat-gold { color: var(--gold) !important; }

        /* ─── Process ─── */
        .process { padding: 8rem 3rem; background: var(--white); position: relative; overflow: hidden; }
        .process::before {
          content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,163,90,.3), transparent);
        }
        .section-tag { font-size: .7rem; letter-spacing: .15em; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: .6rem; }
        .section-tag::before { content: ''; width: 24px; height: 1.5px; background: var(--gold); display: inline-block; }
        .section-h2 { font-family: 'Playfair Display', serif; font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 700; color: var(--ink); line-height: 1.1; letter-spacing: -.03em; margin-bottom: 1.25rem; }
        .section-sub { color: var(--text-mid); font-weight: 300; line-height: 1.9; max-width: 480px; font-size: 1rem; }

        .process-layout { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2fr; gap: 6rem; align-items: start; }
        .process-aside { position: sticky; top: 7rem; }
        .process-steps { display: flex; flex-direction: column; gap: 0; }
        .process-step {
          display: grid; grid-template-columns: 56px 1fr; gap: 2rem; padding: 2.25rem 2rem;
          border-radius: var(--r-md); transition: all .3s; position: relative;
        }
        .process-step::after { content: ''; position: absolute; left: calc(28px + 2rem - 1px); top: calc(2.25rem + 56px); bottom: 0; width: 1px; background: var(--parchment-deep); }
        .process-step:last-child::after { display: none; }
        .process-step:hover { background: var(--parchment); }
        .step-num-wrap { position: relative; }
        .step-num-circle {
          width: 56px; height: 56px; border-radius: 50%;
          background: var(--ink); color: var(--gold-light);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700;
          flex-shrink: 0; position: relative; z-index: 1; transition: all .3s;
          box-shadow: 0 4px 16px rgba(14,28,23,.15);
        }
        .process-step:hover .step-num-circle { background: var(--gold); color: var(--ink); transform: scale(1.08); }
        .step-body h3 { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--ink); margin-bottom: .6rem; }
        .step-body p { color: var(--text-mid); font-weight: 300; line-height: 1.8; font-size: .95rem; }
        .step-chip { display: inline-flex; align-items: center; gap: .4rem; margin-top: .875rem; font-size: .68rem; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--moss); background: rgba(61,107,88,.1); border-radius: 100px; padding: .3rem .875rem; }

        /* ─── Benefits ─── */
        .benefits { padding: 8rem 3rem; background: var(--ink); position: relative; overflow: hidden; }
        .benefits-orb1 { position: absolute; width: 700px; height: 700px; right: -200px; top: -200px; border-radius: 50%; background: radial-gradient(circle, rgba(61,107,88,.25) 0%, transparent 70%); }
        .benefits-orb2 { position: absolute; width: 400px; height: 400px; left: -100px; bottom: -100px; border-radius: 50%; background: radial-gradient(circle, rgba(196,163,90,.15) 0%, transparent 70%); }
        .benefits-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 7rem; align-items: center; position: relative; z-index: 1; }
        .benefits .section-tag { color: var(--gold-light); }
        .benefits .section-tag::before { background: var(--gold-light); }
        .benefits .section-h2 { color: var(--parchment); }
        .benefits .section-sub { color: rgba(248,243,234,.5); }

        .benefit-grid { display: flex; flex-direction: column; gap: 1rem; margin-top: 2.5rem; }
        .benefit-row {
          display: flex; gap: 1.25rem; align-items: flex-start;
          padding: 1.4rem 1.6rem; border-radius: var(--r-md);
          background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.07);
          transition: all .3s;
        }
        .benefit-row:hover { background: rgba(255,255,255,.075); border-color: rgba(196,163,90,.2); transform: translateX(4px); }
        .benefit-icon-box { width: 44px; height: 44px; border-radius: .875rem; background: rgba(196,163,90,.12); display: flex; align-items: center; justify-content: center; color: var(--gold-light); flex-shrink: 0; }
        .benefit-body strong { display: block; color: var(--parchment); font-size: .92rem; font-weight: 600; margin-bottom: .25rem; }
        .benefit-body span { color: rgba(248,243,234,.45); font-size: .83rem; font-weight: 300; line-height: 1.65; }

        .benefits-photo { border-radius: var(--r-xl); overflow: hidden; aspect-ratio: 3/4; position: relative; box-shadow: var(--shadow-xl); }
        .benefits-photo img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.75) saturate(.85); }
        .benefits-photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,28,23,.75) 0%, transparent 55%); }
        .benefits-photo-chip { position: absolute; top: 1.75rem; left: 1.75rem; background: var(--gold); color: var(--ink); padding: .4rem 1.1rem; border-radius: 100px; font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
        .benefits-photo-quote { position: absolute; bottom: 2rem; left: 2rem; right: 2rem; }
        .benefits-photo-quote p { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.1rem; color: rgba(248,243,234,.85); line-height: 1.55; }

        /* ─── Testimonials ─── */
        .testimonials { padding: 8rem 3rem; background: var(--parchment); }
        .testimonials-inner { max-width: 1280px; margin: 0 auto; }
        .test-header { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: end; margin-bottom: 4rem; }
        .test-avg { text-align: right; }
        .test-avg-num { font-family: 'Playfair Display', serif; font-size: 5rem; font-weight: 700; color: var(--ink); line-height: 1; letter-spacing: -.05em; }
        .test-avg-stars { display: flex; gap: .3rem; justify-content: flex-end; color: var(--gold); margin: .5rem 0; }
        .test-avg-label { font-size: .75rem; color: var(--text-soft); letter-spacing: .06em; text-transform: uppercase; }
        .test-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .test-card {
          background: var(--white); border-radius: var(--r-lg); padding: 2.25rem;
          border: 1px solid rgba(14,28,23,.06); transition: all .35s; display: flex; flex-direction: column;
        }
        .test-card:hover { box-shadow: var(--shadow-md); transform: translateY(-5px); border-color: rgba(196,163,90,.2); }
        .test-stars { display: flex; gap: .25rem; color: var(--gold); margin-bottom: 1.25rem; }
        .test-quote-icon { color: var(--gold-pale); margin-bottom: .75rem; }
        .test-card blockquote { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-style: italic; color: var(--ink); line-height: 1.65; flex-grow: 1; margin-bottom: 1.75rem; }
        .test-sep { height: 1px; background: var(--parchment-dark); margin-bottom: 1.25rem; }
        .test-author { display: flex; align-items: center; gap: 1rem; }
        .test-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--ink); display: flex; align-items: center; justify-content: center; color: var(--gold-light); font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; flex-shrink: 0; }
        .test-meta strong { display: block; font-size: .88rem; font-weight: 600; color: var(--text-dark); }
        .test-meta span { font-size: .78rem; color: var(--text-soft); }

        /* ─── Pricing ─── */
        .pricing { padding: 8rem 3rem; background: var(--white); }
        .pricing::before { content: ''; display: block; height: 1px; background: linear-gradient(90deg, transparent, rgba(196,163,90,.3), transparent); margin-bottom: 0; position: absolute; left: 0; right: 0; }
        .pricing-inner { max-width: 1280px; margin: 0 auto; }
        .pricing-header-area { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: end; margin-bottom: 4rem; }
        .pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
        .pricing-card {
          background: var(--parchment); border-radius: var(--r-lg); overflow: hidden;
          display: flex; flex-direction: column; border: 1.5px solid rgba(14,28,23,.07);
          transition: all .4s cubic-bezier(0.16,1,0.3,1); position: relative;
        }
        .pricing-card:hover { transform: translateY(-10px); box-shadow: var(--shadow-lg); border-color: rgba(196,163,90,.3); }
        .pricing-card.featured { background: var(--ink); border-color: var(--gold); box-shadow: var(--shadow-lg); }
        .pricing-card.featured:hover { transform: translateY(-14px); box-shadow: var(--shadow-xl); }
        .featured-tag {
          position: absolute; top: 1.1rem; right: 1.1rem;
          background: var(--gold); color: var(--ink); font-size: .62rem; font-weight: 700;
          padding: .3rem .8rem; border-radius: 100px; letter-spacing: .07em; text-transform: uppercase;
        }
        .card-head { padding: 2rem 1.75rem 1.25rem; }
        .card-icon { width: 52px; height: 52px; border-radius: 1rem; background: rgba(14,28,23,.08); display: flex; align-items: center; justify-content: center; color: var(--ink-soft); margin-bottom: 1.25rem; }
        .pricing-card.featured .card-icon { background: rgba(255,255,255,.1); color: var(--gold-light); }
        .card-name { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--ink); margin-bottom: .4rem; }
        .pricing-card.featured .card-name { color: var(--parchment); }
        .card-price { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--ink); line-height: 1.1; margin: .875rem 0 .25rem; }
        .pricing-card.featured .card-price { color: var(--parchment); }
        .card-price small { font-size: .85rem; font-weight: 400; color: var(--text-soft); font-family: 'DM Sans', sans-serif; }
        .pricing-card.featured .card-price small { color: rgba(248,243,234,.5); }
        .card-duration { font-size: .68rem; text-transform: uppercase; letter-spacing: .07em; color: var(--text-soft); }
        .pricing-card.featured .card-duration { color: rgba(248,243,234,.4); }
        .card-divider { height: 1px; background: rgba(14,28,23,.07); margin: 0 1.75rem; }
        .pricing-card.featured .card-divider { background: rgba(255,255,255,.1); }
        .card-features { padding: 1.5rem 1.75rem; flex-grow: 1; }
        .card-features li { display: flex; align-items: flex-start; gap: .75rem; font-size: .83rem; color: var(--text-mid); margin-bottom: .875rem; line-height: 1.5; list-style: none; }
        .pricing-card.featured .card-features li { color: rgba(248,243,234,.6); }
        .card-features li svg { color: var(--gold); flex-shrink: 0; margin-top: 1px; }
        .pricing-card.featured .card-features li svg { color: var(--gold-light); }
        .card-footer { padding: 0 1.75rem 2rem; }
        .card-btn {
          display: flex; align-items: center; justify-content: center; gap: .6rem;
          width: 100%; padding: .9rem; border-radius: 100px; font-family: 'DM Sans', sans-serif;
          font-size: .8rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
          cursor: pointer; transition: all .25s; border: 2px solid var(--ink); background: var(--ink); color: var(--parchment);
        }
        .card-btn:hover { background: var(--gold); border-color: var(--gold); color: var(--ink); }
        .card-btn.outline { background: transparent; color: var(--ink); }
        .card-btn.outline:hover { background: var(--ink); color: var(--parchment); }
        .pricing-card.featured .card-btn { background: var(--gold); border-color: var(--gold); color: var(--ink); }
        .pricing-card.featured .card-btn:hover { background: var(--gold-light); border-color: var(--gold-light); }
        .pricing-footnote { text-align: center; margin-top: 3rem; font-size: .78rem; color: var(--text-faint); padding-top: 2rem; border-top: 1px dashed rgba(14,28,23,.12); }

        /* ─── Booking ─── */
        .booking { padding: 8rem 3rem; background: var(--parchment-dark); }
        .booking-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.4fr; gap: 6rem; align-items: start; }
        .booking-aside { position: sticky; top: 7rem; }
        .booking-trust { display: flex; flex-direction: column; gap: .875rem; margin-top: 3rem; }
        .trust-row { display: flex; align-items: center; gap: .875rem; }
        .trust-icon { width: 36px; height: 36px; border-radius: .75rem; background: var(--ink); color: var(--gold-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .trust-text { font-size: .88rem; color: var(--text-mid); font-weight: 400; }

        .booking-form-wrap { background: var(--white); border-radius: var(--r-xl); padding: 3rem; box-shadow: var(--shadow-lg); border: 1px solid rgba(14,28,23,.06); }
        .form-head-h { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: var(--ink); margin-bottom: .4rem; }
        .form-head-p { font-size: .85rem; color: var(--text-soft); font-weight: 300; margin-bottom: 2.25rem; }
        .fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
        .f { display: flex; flex-direction: column; gap: .4rem; }
        .f.full { grid-column: 1 / -1; }
        .flabel {
          font-size: .68rem; font-weight: 600; letter-spacing: .09em; text-transform: uppercase;
          color: var(--text-soft); display: flex; align-items: center; gap: .4rem;
        }
        .flabel svg { color: var(--gold); }
        .finput {
          background: var(--parchment); border: 1.5px solid rgba(14,28,23,.1);
          color: var(--text-dark); padding: .9rem 1.1rem; border-radius: .875rem;
          font-family: 'DM Sans', sans-serif; font-size: .9rem; font-weight: 400;
          width: 100%; outline: none; transition: all .25s; appearance: none;
        }
        .finput:focus { border-color: var(--ink); background: var(--white); box-shadow: 0 0 0 4px rgba(14,28,23,.06); }
        .fdivider { height: 1px; background: rgba(14,28,23,.07); grid-column: 1 / -1; margin: .5rem 0; }
        .fsubmit {
          width: 100%; grid-column: 1 / -1;
          background: var(--ink); color: var(--gold-light); padding: 1.15rem 2rem;
          border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: .9rem;
          font-weight: 600; letter-spacing: .04em; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: .65rem;
          transition: all .3s; box-shadow: 0 8px 32px rgba(14,28,23,.18);
        }
        .fsubmit:hover { background: var(--gold); color: var(--ink); transform: translateY(-2px); box-shadow: 0 16px 48px rgba(196,163,90,.28); }
        .fnote { text-align: center; font-size: .72rem; color: var(--text-faint); grid-column: 1 / -1; margin-top: .25rem; }

        /* ─── Success ─── */
        .success { text-align: center; padding: 1.5rem 0; }
        .success-icon { width: 84px; height: 84px; background: #e5f4ec; color: #1e7a48; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; }
        .success h2 { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 700; color: var(--ink); margin-bottom: .875rem; }
        .success p { color: var(--text-mid); font-weight: 300; line-height: 1.9; max-width: 380px; margin: 0 auto 2rem; font-size: .95rem; }
        .btn-text { background: none; border: none; color: var(--moss); font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: .88rem; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }

        /* ─── Footer ─── */
        .footer { background: var(--ink); color: rgba(248,243,234,.45); padding: 5rem 3rem 2.5rem; }
        .footer-inner { max-width: 1280px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 4rem; padding-bottom: 4rem; border-bottom: 1px solid rgba(255,255,255,.07); margin-bottom: 2.5rem; }
        .footer-brand .logo-name { color: var(--parchment); }
        .footer-brand .logo-tagline { color: rgba(248,243,234,.35); }
        .footer-brand p { font-size: .88rem; font-weight: 300; line-height: 1.9; margin-top: 1.25rem; max-width: 260px; }
        .footer-col h5 { color: var(--parchment); font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; margin-bottom: 1.25rem; }
        .footer-col a { display: block; color: rgba(248,243,234,.45); font-size: .88rem; font-weight: 300; text-decoration: none; margin-bottom: .6rem; transition: color .2s; }
        .footer-col a:hover { color: var(--gold-light); }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; font-size: .75rem; }
        .footer-cities { display: flex; align-items: center; gap: .75rem; }
        .gold-sep { display: inline-block; width: 3px; height: 3px; border-radius: 50%; background: var(--gold); vertical-align: middle; }

        /* ─── Responsive ─── */
        @media (max-width: 1100px) {
          .pricing-grid { grid-template-columns: repeat(2,1fr); }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .stats .stat-item:nth-child(2) { border-right: none; }
        }
        @media (max-width: 1024px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-visual { display: none; }
          .process-layout { grid-template-columns: 1fr; }
          .process-aside { position: static; }
          .benefits-inner { grid-template-columns: 1fr; }
          .benefits-photo { display: none; }
          .test-grid { grid-template-columns: 1fr 1fr; }
          .test-header { grid-template-columns: 1fr; }
          .test-avg { text-align: left; }
          .test-avg-stars { justify-content: flex-start; }
          .pricing-header-area { grid-template-columns: 1fr; }
          .booking-inner { grid-template-columns: 1fr; }
          .booking-aside { position: static; }
          .footer-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .nav { padding: 0 1.5rem; }
          .nav-links { display: none; }
          .menu-btn { display: block; }
          .hero-inner { padding: 7rem 1.5rem 4rem; }
          .process,.benefits,.testimonials,.pricing,.booking { padding-left: 1.5rem; padding-right: 1.5rem; }
          .process-step { grid-template-columns: 44px 1fr; gap: 1.25rem; }
          .step-num-circle { width: 44px; height: 44px; font-size: 1rem; }
          .test-grid { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; }
          .fgrid { grid-template-columns: 1fr; }
          .f.full { grid-column: 1; }
          .fdivider,.fsubmit,.fnote { grid-column: 1; }
          .footer-top { grid-template-columns: 1fr; gap: 2rem; }
          .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
          .stats-inner { grid-template-columns: 1fr 1fr; }
          .hero-pill { display: none; }
          .booking-form-wrap { padding: 2rem 1.5rem; }
        }
      `}</style>

      {/* Nav */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="logo">
            <div className="logo-icon"><Car size={20} /></div>
            <div className="logo-wordmark">
              <span className="logo-name">TheraDrive</span>
              <span className="logo-tagline">Mental Wellness · Maroc</span>
            </div>
          </a>
          <div className="nav-links">
            <a href="#process" className="nav-link">Processus</a>
            <a href="#benefits" className="nav-link">Avantages</a>
            <a href="#pricing" className="nav-link">Tarifs</a>
            <a href="#testimonials" className="nav-link">Avis</a>
            <a href="#booking" className="nav-cta">Réserver <ArrowRight size={13} /></a>
          </div>
          <button className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu size={26} /></button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className={`mobile-nav${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        <button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Fermer"><X size={30} /></button>
        {[["Processus","process"],["Avantages","benefits"],["Tarifs","pricing"],["Avis","testimonials"]].map(([l,id]) => (
          <a key={l} href={`#${id}`} className="mobile-link" onClick={() => setMenuOpen(false)}>{l}</a>
        ))}
        <a href="#booking" className="nav-cta" onClick={() => setMenuOpen(false)}>Réserver une séance</a>
      </div>

      {/* Hero */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-bg" />
        <div className="hero-orb o1" /><div className="hero-orb o2" /><div className="hero-orb o3" />
        <div className="hero-noise" />
        <div className="hero-grid-lines" />
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">Disponible à Casa · Rabat · Marrakech</span>
            </div>
            <h1 id="hero-heading">
              <span className="line"><span className={`word w1`}>Votre</span> <span className={`word w2`}>esprit</span></span>
              <span className="line"><span className={`word w3`}>mérite</span> <span className={`word w4`}>un</span></span>
              <span className="line"><span className={`word w5`}><em>sanctuaire.</em></span></span>
            </h1>
            <p className="hero-desc">
              Un salon de thérapie mobile premium qui vient à votre porte. Insonorisé, discret, avec des professionnels agréés — parce que votre bien-être doit s'adapter à votre vie, pas l'inverse.
            </p>
            <div className="hero-actions">
              <a href="#booking" className="btn-primary">Réserver une séance <ChevronRight size={16} /></a>
              <a href="#process" className="btn-secondary">Comment ça marche <ChevronDown size={16} /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-line-deco"><span /><span /></div>
            <div className="hero-frame">
              <img src="https://www.eyeofriyadh.com/news_images/2019/04/25189ef551b27.jpg" alt="Intérieur de la cabine TheraDrive" loading="eager" />
              <div className="hero-frame-caption">
                <p className="tag">Votre espace privé</p>
                <h3>Un design pensé pour des conversations authentiques</h3>
              </div>
            </div>
            <div className="hero-pill p1">
              <div className="pill-icon green"><ShieldCheck size={19} /></div>
              <div>
                <div className="pill-label">Certifié</div>
                <div className="pill-value">Thérapeutes agréés</div>
              </div>
            </div>
            <div className="hero-pill p2">
              <div className="pill-icon gold"><Headphones size={19} /></div>
              <div>
                <div className="pill-label">Cabine</div>
                <div className="pill-value">Entièrement insonorisée</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* Stats */}
      <section className="stats" aria-label="Chiffres clés">
        <div className="stats-inner">
          {[
            { n: 500, s: "+", l: "Séances réalisées", gold: false },
            { n: 98, s: "%", l: "Taux de satisfaction", gold: true },
            { n: 12, s: "", l: "Professionnels agréés", gold: false },
            { n: 3, s: "", l: "Villes couvertes", gold: false }
          ].map((item, i) => (
            <AnimatedSection key={i} className="stat-item" delay={i * 80}>
              <div className={`stat-num${item.gold ? " stat-gold" : ""}`}>
                <Counter end={item.n} suffix={item.s} />
              </div>
              <div className="stat-label">{item.l}</div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="process" aria-labelledby="process-heading">
        <div className="process-layout">
          <AnimatedSection className="process-aside">
            <p className="section-tag">Le processus</p>
            <h2 className="section-h2" id="process-heading">Trois étapes vers votre prochaine séance</h2>
            <p className="section-sub">Nous avons supprimé chaque barrière entre vous et le soutien que vous méritez.</p>
          </AnimatedSection>
          <div className="process-steps">
            {[
              { n: "01", icon: <Calendar size={20} />, title: "Réservez votre créneau", body: "Choisissez votre ville, date et horaire. Sélectionnez un psychologue clinicien ou un coach exécutif. Aucune liste d'attente.", chip: "2 min · Confirmation sous 2h" },
              { n: "02", icon: <Car size={20} />, title: "Nous venons à vous", body: "Notre lounge mobile discret et entièrement équipé arrive à votre domicile, bureau ou tout lieu de votre choix. Zéro trajet pour vous.", chip: "Partout dans votre ville" },
              { n: "03", icon: <Heart size={20} />, title: "Commencez votre cheminement", body: "Entrez dans la cabine insonorisée pour une séance ininterrompue de 50 minutes avec un professionnel agréé, dans un cadre d'intimité totale.", chip: "50 min · 100% confidentiel" }
            ].map((s, i) => (
              <AnimatedSection key={i} className="process-step" delay={i * 120}>
                <div className="step-num-wrap">
                  <div className="step-num-circle">{s.n}</div>
                </div>
                <div className="step-body">
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <span className="step-chip"><CheckCircle2 size={11} /> {s.chip}</span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="benefits" aria-labelledby="benefits-heading">
        <div className="benefits-orb1" /><div className="benefits-orb2" />
        <div className="benefits-inner">
          <AnimatedSection>
            <p className="section-tag">Pourquoi TheraDrive</p>
            <h2 className="section-h2" id="benefits-heading">Bien-être repensé pour la vie moderne</h2>
            <p className="section-sub">Discrétion, confort et excellence — réunis dans un seul espace qui se déplace avec vous.</p>
            <div className="benefit-grid">
              {[
                { icon: <Lock size={18} />, title: "Discrétion absolue", body: "Séance privée, anonymat garanti à chaque point de contact. Aucune donnée vendue." },
                { icon: <Headphones size={18} />, title: "Cabine acoustique certifiée", body: "Isolation phonique totale — zéro bruit extérieur, zéro interruption." },
                { icon: <ShieldCheck size={18} />, title: "Praticiens agréés uniquement", body: "Chaque professionnel est diplômé, vérifié et supervisé par notre équipe." },
                { icon: <Leaf size={18} />, title: "Zéro salle d'attente", body: "Fini la culture de la clinique. Votre confort commence dès notre arrivée à votre porte." }
              ].map((b, i) => (
                <AnimatedSection key={i} className="benefit-row" delay={i * 100}>
                  <div className="benefit-icon-box">{b.icon}</div>
                  <div className="benefit-body">
                    <strong>{b.title}</strong>
                    <span>{b.body}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="benefits-photo">
              <img src="https://www.lexus.co.id/content/dam/lexus-v3-indonesia/november-2024/lm-500h-4-seater/LMC0006.jpg" alt="Salon privé TheraDrive" loading="lazy" />
              <div className="benefits-photo-overlay" />
              <div className="benefits-photo-chip">Votre salon privé</div>
              <div className="benefits-photo-quote">
                <p>"Un espace de liberté totale, loin du monde."</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials" aria-labelledby="test-heading">
        <div className="testimonials-inner">
          <AnimatedSection className="test-header">
            <div>
              <p className="section-tag">Témoignages</p>
              <h2 className="section-h2" id="test-heading">Ils ont retrouvé<br />la paix</h2>
            </div>
            <div className="test-avg">
              <div className="test-avg-num">4.9</div>
              <div className="test-avg-stars">{[...Array(5)].map((_,i) => <Star key={i} size={20} fill="currentColor" />)}</div>
              <div className="test-avg-label">Note moyenne · 500+ séances</div>
            </div>
          </AnimatedSection>
          <div className="test-grid">
            {[
              { q: "Je n'aurais jamais imaginé que la thérapie puisse être aussi naturelle. Faire ma séance dans la voiture m'a permis de pleurer, de respirer et d'être moi-même sans avoir à jouer un rôle en sortant d'une clinique.", name: "Leila B.", city: "Casablanca", init: "L" },
              { q: "En tant que cadre, j'avais besoin d'une solution adaptée à mes journées chargées. TheraDrive s'est garé devant mon bureau et j'ai eu la séance la plus productive de ma vie en 50 minutes. Absolument remarquable.", name: "Mehdi A.", city: "Rabat", init: "M" },
              { q: "L'insonorisation est extraordinaire. J'avais complètement oublié que j'étais dans un véhicule. C'était comme si une suite de thérapie haut de gamme était venue directement à moi.", name: "Sara E.", city: "Mohammedia", init: "S" }
            ].map((t, i) => (
              <AnimatedSection key={i} className="test-card" delay={i * 120}>
                <div className="test-stars">{[...Array(5)].map((_,j) => <Star key={j} size={13} fill="currentColor" />)}</div>
                <div className="test-quote-icon"><Quote size={22} /></div>
                <blockquote>{t.q}</blockquote>
                <div className="test-sep" />
                <div className="test-author">
                  <div className="test-avatar">{t.init}</div>
                  <div className="test-meta">
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing" aria-labelledby="pricing-heading">
        <div className="pricing-inner">
          <AnimatedSection className="pricing-header-area">
            <div>
              <p className="section-tag">Formules & Tarifs</p>
              <h2 className="section-h2" id="pricing-heading">Des offres pensées pour<br />votre rythme de vie</h2>
            </div>
            <p className="section-sub" style={{alignSelf:"end"}}>Chaque formule inclut la confidentialité garantie, l'insonorisation et la flexibilité horaire. Sans engagement pour les séances individuelles.</p>
          </AnimatedSection>
          <div className="pricing-grid">
            {/* Thérapie */}
            <AnimatedSection>
              <div className="pricing-card" style={{height:"100%"}}>
                <div className="card-head">
                  <div className="card-icon"><Heart size={24} /></div>
                  <div className="card-name">Thérapie Clinique</div>
                  <div className="card-price">1 200 – 1 500 <small>DH</small></div>
                  <div className="card-duration">Séance 45 – 60 min</div>
                </div>
                <div className="card-divider" />
                <div className="card-features">
                  <ul>
                    <li><CheckCircle2 size={14} /> Anxiété, dépression, burn-out profond</li>
                    <li><CheckCircle2 size={14} /> Psychologue clinicien HCP agréé</li>
                    <li><CheckCircle2 size={14} /> Cabine insonorisée & discrétion totale</li>
                    <li><CheckCircle2 size={14} /> Aucun déplacement requis</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <button className="card-btn" onClick={selectTherapy}>Choisir cette formule <ArrowRight size={13} /></button>
                </div>
              </div>
            </AnimatedSection>

            {/* Coaching — featured */}
            <AnimatedSection delay={100}>
              <div className="pricing-card featured" style={{height:"100%"}}>
                <div className="featured-tag">⭐ Populaire</div>
                <div className="card-head">
                  <div className="card-icon"><Sparkles size={24} /></div>
                  <div className="card-name">Coaching Exécutif</div>
                  <div className="card-price">1 500 – 1 800 <small>DH</small></div>
                  <div className="card-duration">Séance 50 min</div>
                </div>
                <div className="card-divider" />
                <div className="card-features">
                  <ul>
                    <li><CheckCircle2 size={14} /> Leadership & optimisation de performance</li>
                    <li><CheckCircle2 size={14} /> Coach certifié ICF / Executive</li>
                    <li><CheckCircle2 size={14} /> Stratégies sur-mesure (prise de décision)</li>
                    <li><CheckCircle2 size={14} /> Suivi post-séance personnalisé</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <button className="card-btn" onClick={selectCoach}>Choisir cette formule <ArrowRight size={13} /></button>
                </div>
              </div>
            </AnimatedSection>

            {/* Sérénité */}
            <AnimatedSection delay={200}>
              <div className="pricing-card" style={{height:"100%"}}>
                <div className="card-head">
                  <div className="card-icon"><CalendarClock size={24} /></div>
                  <div className="card-name">Abonnement Sérénité</div>
                  <div className="card-price">À partir de 5 000 <small>DH/mois</small></div>
                  <div className="card-duration">4 séances incluses</div>
                </div>
                <div className="card-divider" />
                <div className="card-features">
                  <ul>
                    <li><CheckCircle2 size={14} /> 4 séances / mois (thérapie ou coaching)</li>
                    <li><CheckCircle2 size={14} /> Conciergerie prioritaire 7j/7</li>
                    <li><CheckCircle2 size={14} /> Réservation instantanée sans délai</li>
                    <li><CheckCircle2 size={14} /> Accès praticiens seniors exclusifs</li>
                    <li><Gem size={14} /> Cadeau de bienvenue — rituel sensoriel</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <button className="card-btn outline" onClick={handleContactSubscription}>Contacter un conseiller <PhoneCall size={13} /></button>
                </div>
              </div>
            </AnimatedSection>

            {/* Corporate */}
            <AnimatedSection delay={300}>
              <div className="pricing-card" style={{height:"100%"}}>
                <div className="card-head">
                  <div className="card-icon"><Briefcase size={24} /></div>
                  <div className="card-name">Corporate Wellness Day</div>
                  <div className="card-price">12 000 <small>DH / journée</small></div>
                  <div className="card-duration">B2B · jusqu'à 8 collaborateurs</div>
                </div>
                <div className="card-divider" />
                <div className="card-features">
                  <ul>
                    <li><CheckCircle2 size={14} /> Le Lexus stationne au siège de votre entreprise</li>
                    <li><CheckCircle2 size={14} /> Sessions individuelles & ateliers collectifs</li>
                    <li><CheckCircle2 size={14} /> Bilan de stress & énergétique d'équipe</li>
                    <li><Building2 size={14} /> Conférence santé mentale en entreprise</li>
                    <li><Leaf size={14} /> Pack premium : collations & goodies bien-être</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <button className="card-btn outline" onClick={handleContactCorporate}>Demander un devis <ArrowRight size={13} /></button>
                </div>
              </div>
            </AnimatedSection>
          </div>
          <div className="pricing-footnote">
            Tous nos tarifs incluent la confidentialité garantie, l'insonorisation et la flexibilité horaire. TVA non applicable selon l'article 92 du CGI.
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="booking" aria-labelledby="booking-heading">
        <div className="booking-inner">
          <AnimatedSection className="booking-aside">
            <p className="section-tag">Réservation</p>
            <h2 className="section-h2" id="booking-heading">Prêt quand<br />vous l'êtes</h2>
            <p className="section-sub" style={{marginTop:"1rem"}}>Aucune pression, aucun engagement tant que nous n'avons pas confirmé. Faites le premier pas — nous nous occupons du reste.</p>
            <div className="booking-trust">
              {[
                [<CheckCircle2 size={15} />, "Paiement uniquement après confirmation"],
                [<CheckCircle2 size={15} />, "Annulation gratuite jusqu'à 24h avant"],
                [<CheckCircle2 size={15} />, "Confidentialité totale garantie"],
                [<CheckCircle2 size={15} />, "Réponse de notre équipe sous 2 heures"]
              ].map(([icon, text], i) => (
                <div key={i} className="trust-row">
                  <div className="trust-icon">{icon}</div>
                  <span className="trust-text">{text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={150} className="booking-form-wrap">
            {step === 1 ? (
              <>
                <h3 className="form-head-h">Réservez votre séance</h3>
                <p className="form-head-p">Indiquez vos coordonnées et préférences. Notre concierge vous confirme sous 2 heures.</p>
                <form onSubmit={submit}>
                  <div className="fgrid">
                    <div className="f">
                      <label className="flabel"><User size={11} /> Nom complet</label>
                      <input type="text" required className="finput" placeholder="Votre nom et prénom"
                        value={booking.name} onChange={e => setBooking({...booking, name: e.target.value})} />
                    </div>
                    <div className="f">
                      <label className="flabel"><Phone size={11} /> Téléphone</label>
                      <input type="tel" required className="finput" placeholder="06 XX XX XX XX"
                        value={booking.phone} onChange={e => setBooking({...booking, phone: e.target.value})} />
                    </div>
                    <div className="f">
                      <label className="flabel"><MapPin size={11} /> Ville</label>
                      <select required className="finput" value={booking.city} onChange={e => setBooking({...booking, city: e.target.value})}>
                        <option value="" disabled>Sélectionnez une ville…</option>
                        <option value="Casablanca">Casablanca</option>
                        <option value="Rabat">Rabat</option>
                        <option value="Marrakech">Marrakech</option>
                      </select>
                    </div>
                    <div className="f">
                      <label className="flabel"><Star size={11} /> Service</label>
                      <select required className="finput" value={booking.service} onChange={e => setBooking({...booking, service: e.target.value})}>
                        <option value="" disabled>Sélectionnez un service…</option>
                        <option value="psychologist">Psychologue clinicien</option>
                        <option value="coach">Coach exécutif</option>
                      </select>
                    </div>
                    <div className="f">
                      <label className="flabel"><Calendar size={11} /> Date souhaitée</label>
                      <input type="date" required className="finput" value={booking.date} onChange={e => setBooking({...booking, date: e.target.value})} />
                    </div>
                    <div className="f">
                      <label className="flabel"><Clock size={11} /> Horaire</label>
                      <select required className="finput" value={booking.time} onChange={e => setBooking({...booking, time: e.target.value})}>
                        <option value="" disabled>Sélectionnez un horaire…</option>
                        <option value="09:00">09:00</option>
                        <option value="11:00">11:00</option>
                        <option value="14:00">14:00</option>
                        <option value="16:00">16:00</option>
                        <option value="18:00">18:00</option>
                      </select>
                    </div>
                    <div className="fdivider" />
                    <button type="submit" className="fsubmit">
                      Confirmer la demande de réservation <ChevronRight size={16} />
                    </button>
                    <p className="fnote">Vos informations ne sont jamais partagées. Confidentialité garantie.</p>
                  </div>
                </form>
              </>
            ) : (
              <div className="success">
                <div className="success-icon"><CheckCircle2 size={42} /></div>
                <h2>Demande envoyée !</h2>
                <p>Merci <strong>{booking.name || "cher client"}</strong>. Votre séance TheraDrive du <strong>{booking.date}</strong> à <strong>{booking.city}</strong> a bien été reçue. Notre concierge vous contactera sous 2 heures au <strong>{booking.phone}</strong> pour confirmer.</p>
                <button className="btn-text" onClick={() => setStep(1)}>← Réserver une autre séance</button>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="logo" style={{textDecoration:"none"}}>
                <div className="logo-icon" style={{background:"rgba(255,255,255,.1)", color:"var(--gold-light)"}}><Car size={20} /></div>
                <div className="logo-wordmark">
                  <span className="logo-name">TheraDrive</span>
                  <span className="logo-tagline">Mental Wellness · Maroc</span>
                </div>
              </a>
              <p>Soins de santé mentale mobiles premium, délivrés avec discrétion et dignité à travers le Maroc.</p>
            </div>
            <div className="footer-col">
              <h5>Navigation</h5>
              <a href="#process">Le processus</a>
              <a href="#benefits">Pourquoi nous</a>
              <a href="#pricing">Tarifs & Formules</a>
              <a href="#testimonials">Témoignages</a>
              <a href="#booking">Réserver</a>
            </div>
            <div className="footer-col">
              <h5>Légal</h5>
              <a href="#">Confidentialité</a>
              <a href="#">Conditions d'utilisation</a>
              <a href="#">Politique cookies</a>
              <a href="#">Nous contacter</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 TheraDrive Maroc — Tous droits réservés.</span>
            <div className="footer-cities">
              <span>Casablanca</span>
              <span className="gold-sep" />
              <span>Rabat</span>
              <span className="gold-sep" />
              <span>Marrakech</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}