"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

const projects = [
  { id:"01", title:"Deception Orchestrator", type:"Security / Flagship", description:"A self-hostable SOC analyst console for controlled deception labs, turning honeypot and URL-canary activity into MITRE ATT&CK-tagged investigations.", stack:["Python","FastAPI","Next.js","Docker"], href:"https://github.com/Anantgoel2005/deception-orchestrator", accent:"DEFENSE", image:"/projects/deception.png", alt:"Deception Orchestrator live security telemetry dashboard" },
  { id:"02", title:"Mouseion", type:"Local-first / Product", description:"A private, offline desktop library for PDF and EPUB collections—with reading progress, favorites, metadata, and no cloud dependency.", stack:["TypeScript","React","Electron","Vite"], href:"https://github.com/Anantgoel2005/Mouseion", accent:"PRIVATE", image:"/projects/mouseion-library.png", alt:"Mouseion private offline library collection interface" },
  { id:"03", title:"Traffic Intelligence", type:"Applied AI / Vision", description:"Real-time traffic analytics that detects and tracks road activity, records incidents, and streams operational telemetry to a live dashboard.", stack:["Python","YOLO","ByteTrack","React"], href:"https://github.com/Anantgoel2005/traffic_monitoring_system", accent:"REALTIME", image:"/projects/traffic-overview.jpg", alt:"Traffic Intelligence product overview and live monitoring dashboard" },
  { id:"04", title:"PathWise", type:"Computer Vision / Safety", description:"A road-safety vision pipeline combining object detection, bird’s-eye-view telemetry, and behaviour signals to identify emerging hazards.", stack:["OpenCV","YOLOv10","ByteTrack"], href:"https://github.com/Anantgoel2005/PathWise", accent:"VISION", image:"/projects/pathwise-demo.gif", alt:"Animated PathWise hazard-engine telemetry demonstration" },
  { id:"05", title:"Pentest Agent", type:"Security / CLI", description:"A safety-oriented web assessment tool with explicit scope controls, evidence-first verification, and deterministic reporting.", stack:["Python","HTTPX","Click","CI/CD"], href:"https://github.com/Anantgoel2005/pentest-agent", accent:"SCOPED", image:"/projects/pentest.svg", alt:"Pentest Agent scope, assess, verify, and report workflow" },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    animate(".hero-line", { y:["115%","0%"], opacity:[0,1], delay:stagger(130,{start:180}), duration:1100, ease:"out(4)" });
    animate(".intro-fade", { opacity:[0,1], y:[18,0], delay:stagger(90,{start:700}), duration:800, ease:"out(3)" });
    animate(".core", { rotate:"1turn", duration:18000, loop:true, ease:"linear" });
    animate(".core-orbit.reverse", { rotate:"-1turn", duration:12000, loop:true, ease:"linear" });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target, { opacity:[0,1], y:[56,0], duration:900, ease:"out(4)" });
        observer.unobserve(entry.target);
      });
    }, { threshold:.15 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    root.current?.style.setProperty("--mx", `${event.clientX}px`);
    root.current?.style.setProperty("--my", `${event.clientY}px`);
  };

  return <main ref={root} onPointerMove={trackPointer}>
    <div className="cursor-glow" aria-hidden="true" />
    <nav>
      <a className="identity" href="#top"><span className="sigil">AG</span><span>ANANT.GOEL</span></a>
      <div className="nav-center"><span className="pulse" /> AVAILABLE FOR OPPORTUNITIES</div>
      <div className="nav-links"><a href="#projects">PROJECTS</a><a href="#about">ABOUT</a><a href="mailto:anantgoel2005@gmail.com">CONTACT ↗</a></div>
    </nav>

    <section className="hero" id="top">
      <div className="hero-kicker intro-fade"><span>PORTFOLIO / 2026</span><span>INDIA · 20.5937° N</span></div>
      <div className="hero-title">
        <div className="line-mask"><span className="hero-line">ENGINEERING</span></div>
        <div className="line-mask offset"><span className="hero-line outline">INTELLIGENT</span></div>
        <div className="line-mask"><span className="hero-line">SYSTEMS<span className="dot">.</span></span></div>
      </div>
      <div className="core-wrap intro-fade" aria-hidden="true">
        <div className="core"><span className="core-orbit" /><span className="core-orbit reverse" /><i /></div>
        <span className="core-label">SYSTEMS<br/>ONLINE</span>
      </div>
      <div className="hero-footer intro-fade">
        <p>Applied AI, computer vision, and security engineering—built end to end, from experimental model to dependable product.</p>
        <div className="scroll-cue"><span>SCROLL TO EXPLORE</span><i>↓</i></div>
      </div>
      <div className="hero-index" aria-hidden="true">A—01</div>
    </section>

    <section className="manifesto reveal" id="about">
      <div className="section-code">/ APPROACH</div>
      <p>I build complete workflows around models—not isolated demos. <span>Understandable at the core. Useful at the edge.</span></p>
      <div className="metrics">
        <div><strong>AI</strong><span>Models → Products</span></div>
        <div><strong>CV</strong><span>Pixels → Decisions</span></div>
        <div><strong>SEC</strong><span>Signals → Evidence</span></div>
      </div>
    </section>

    <section className="projects" id="projects">
      <header className="section-header reveal"><div><span className="section-code">/ SELECTED SYSTEMS</span><h2>BUILT FOR<br/>THE REAL WORLD</h2></div><span>[ 05 PROJECTS ]</span></header>
      <div className="project-list">
        {projects.map((project) => <a className="project reveal" href={project.href} target="_blank" rel="noreferrer" key={project.id}>
          <div className="project-id">{project.id}<span>{project.accent}</span></div>
          <div className="project-main"><span className="project-type">{project.type}</span><h3>{project.title}</h3><p>{project.description}</p><div className="project-stack">{project.stack.map(item=><span key={item}>{item}</span>)}</div></div>
          <figure className="project-visual"><img src={project.image} alt={project.alt} loading="lazy" /><figcaption><span>LIVE ARTIFACT</span><span>VIEW / 0{project.id}</span></figcaption></figure>
          <div className="project-arrow">↗</div>
          <div className="project-scan" />
        </a>)}
      </div>
      <a className="all-projects reveal" href="https://github.com/Anantgoel2005?tab=repositories" target="_blank" rel="noreferrer"><span>EXPLORE ALL REPOSITORIES</span><i>GITHUB ↗</i></a>
    </section>

    <section className="protocol reveal">
      <div className="section-code">/ OPERATING PRINCIPLES</div>
      <div className="protocol-grid">
        <div><span>01</span><h4>END TO END</h4><p>Complete systems around models, not notebooks left in isolation.</p></div>
        <div><span>02</span><h4>DETERMINISTIC CORE</h4><p>AI where it improves decisions, with understandable behavior underneath.</p></div>
        <div><span>03</span><h4>PRIVACY FIRST</h4><p>Local-first architecture when reliability and ownership matter.</p></div>
      </div>
    </section>

    <footer>
      <div className="footer-signal"><span className="pulse" /> OPEN CHANNEL</div>
      <h2>LET’S BUILD<br/><span>WHAT’S NEXT.</span></h2>
      <div className="footer-actions">
        <a href="mailto:anantgoel2005@gmail.com">EMAIL ↗</a>
        <a href="https://github.com/Anantgoel2005" target="_blank" rel="noreferrer">GITHUB ↗</a>
        <a href="https://www.linkedin.com/in/ag25goel/" target="_blank" rel="noreferrer">LINKEDIN ↗</a>
      </div>
      <div className="footer-meta"><span>© 2026 ANANT GOEL</span><span>BUILT WITH INTENT / DEPLOYED FROM INDIA</span><a href="#top">RETURN TO TOP ↑</a></div>
    </footer>
  </main>;
}
