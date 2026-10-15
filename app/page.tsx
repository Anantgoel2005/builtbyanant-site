"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const projects = [
  { title: "PathWise", category: "Computer vision", description: "A road-risk prototype that turns vehicle tracks into explainable time-to-collision and cut-in warnings.", highlights: ["Designed the risk pipeline with calibrated road-plane projection and relative-motion logic.", "Integrated telemetry and a dashboard; validated the core rules with reproducible scenario tests."], stack: ["Python", "YOLO", "ByteTrack", "OpenCV"], image: "/projects/pathwise-demo.gif", alt: "PathWise demo showing tracked vehicles and a cut-in warning", href: "https://github.com/Anantgoel2005/PathWise" },
  { title: "Traffic Intelligence", category: "Computer vision", description: "A traffic analytics workflow connecting video perception to an operational dashboard.", highlights: ["Combines road-activity detection, persistent tracking, and incident recording.", "Surfaces traffic telemetry in a React dashboard."], stack: ["Python", "YOLO", "ByteTrack", "React"], image: "/projects/traffic-overview.jpg", alt: "Traffic Intelligence dashboard with tracking and incident telemetry", href: "https://github.com/Anantgoel2005/traffic_monitoring_system" },
  { title: "Deception Orchestrator", category: "Security", description: "A self-hostable analyst console for investigating honeypot and URL-canary activity.", highlights: ["Turns security events into investigations tagged with MITRE ATT&CK techniques.", "Connects a Python API to a Next.js console with Docker deployment."], stack: ["Python", "FastAPI", "Next.js", "Docker"], image: "/projects/deception.png", alt: "Deception Orchestrator console with honeypot events and investigations", href: "https://github.com/Anantgoel2005/deception-orchestrator" },
  { title: "Mouseion", category: "Product", description: "A private desktop library for PDF and EPUB collections, built to work offline.", highlights: ["Brings metadata, favorites, and reading progress into one library interface.", "Packages a React and TypeScript application with Electron, without a cloud dependency."], stack: ["TypeScript", "React", "Electron", "Vite"], image: "/projects/mouseion-library.png", alt: "Mouseion desktop library with books and collection navigation", href: "https://github.com/Anantgoel2005/Mouseion" },
  { title: "Pentest Agent", category: "Security", description: "A scoped web-assessment tool with a structured verification and reporting workflow.", highlights: ["Uses explicit scope controls for authorized assessments.", "Prioritizes evidence-first verification and deterministic reports."], stack: ["Python", "HTTPX", "Click", "CI/CD"], image: "/projects/pentest.svg", alt: "Pentest Agent workflow: scope, assess, verify, and report", href: "https://github.com/Anantgoel2005/pentest-agent" },
];
const capabilities = [
  { title: "Computer vision", description: "Video detection and tracking, calibrated geometry, and explainable risk signals.", tools: "Python · OpenCV · YOLO · ByteTrack", proof: "PathWise / Traffic Intelligence" },
  { title: "Security & backend", description: "Security telemetry, investigation workflows, scoped assessment tooling, and APIs.", tools: "Python · FastAPI · HTTPX · Docker", proof: "Deception Orchestrator / Pentest Agent" },
  { title: "Interfaces & products", description: "Web dashboards and desktop applications that make complex workflows usable.", tools: "TypeScript · React · Next.js · Electron", proof: "Mouseion / Deception Orchestrator" },
];
const filters = ["All", "Computer vision", "Security", "Product"] as const;
const github = "https://github.com/Anantgoel2005";
const linkedin = "https://www.linkedin.com/in/ag25goel/";
const email = "anantgoel2005@gmail.com";
const resumes = {
  general: "/resume/Anant_Goel_Software_Engineering_Resume.pdf",
  vision: "/resume/Anant_Goel_Computer_Vision_Intern_Resume.pdf",
  security: "/resume/Anant_Goel_Security_Engineering_Intern_Resume.pdf",
};
const evidence = [
  { label: "Scenario metrics", path: "/blob/main/docs/demo-metrics.json", note: "Synthetic reference scenario: 180 frames, 540 actor samples. These validate the demo rules, not real-world perception accuracy." },
  { label: "Setup & documentation", path: "#readme", note: "Video detection, tracking, and incident telemetry in one workflow." },
  { label: "Architecture", path: "/blob/main/docs/architecture.md", note: "FastAPI control plane, analyst workspace, and automated build/test workflows." },
  { label: "Installation guide", path: "/blob/main/docs/INSTALLATION.md", note: "Offline desktop workflow with catalogue and Electron smoke tests." },
  { label: "Scope-control tests", path: "/blob/main/tests/test_safety.py", note: "Educational assessment tooling with explicit authorization boundaries and bounded requests." },
];

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    mainRef.current?.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const visibleCount = projects.filter(project => filter === "All" || project.category === filter).length;
  const role = filter === "Computer vision" ? "Computer vision" : filter === "Security" ? "Security engineering" : "Software engineering";
  const contactHref = `mailto:${email}?subject=${encodeURIComponent(`${role} internship opportunity`)}`;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org", "@type": "ProfilePage", url: "https://builtbyanant.site/",
      mainEntity: { "@type": "Person", name: "Anant Goel", url: "https://builtbyanant.site/", sameAs: [github, linkedin],
        description: "Final-year B.Tech Computer Science student at BML Munjal University, graduating May 2027.",
        affiliation: { "@type": "CollegeOrUniversity", name: "BML Munjal University" },
        knowsAbout: ["Computer vision", "Python", "Applied AI", "Security engineering", "React", "FastAPI"],
      },
    }).replace(/</g, "\\u003c") }} />
    <a className="skip-link" href="#main">Skip to content</a>
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="wordmark" href="#top">ANANT GOEL<span>.</span></a>
      <div className="nav-items"><a href="#skills">Skills</a><a href="#work">Projects</a><a href="#contact">Contact</a></div>
    </nav>
    <main id="main" ref={mainRef}>
      <header className="intro" id="top">
        <p className="eyebrow">COMPUTER VISION · APPLIED AI · PYTHON SYSTEMS</p>
        <h1>I turn complex data into useful software.</h1>
        <p className="intro-copy">I’m Anant, a final-year Computer Science student building computer vision pipelines and the software around them: APIs, security tools, and usable interfaces.</p>
        <p className="education-line">BML Munjal University · B.Tech Computer Science · Graduating May 2027</p>
        <p className="availability"><span aria-hidden="true" />Open to on-site / hybrid internships in India</p>
        <p className="availability-details">Flexible duration · Start date to be discussed</p>
        <div className="intro-actions">
          <a className="button button-primary" href={resumes.general} download>Download résumé (PDF) <span aria-hidden="true">↓</span></a>
          <a className="button" href="#work">Explore projects <span aria-hidden="true">↓</span></a>
          <a className="button" href={contactHref}>Discuss an internship <span aria-hidden="true">↗</span></a>
        </div>
        <div className="resume-variants" id="resume"><span>Focused résumés:</span><a href={resumes.vision} download>Computer vision (PDF)</a><a href={resumes.security} download>Security engineering (PDF)</a></div>
        <div className="profile-links"><a href={github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><button type="button" onClick={() => window.print()}>Print this page</button></div>
        <div className="print-contact">{email} · builtbyanant.site<br />github.com/Anantgoel2005 · linkedin.com/in/ag25goel</div>
      </header>
      <section className="skills section" id="skills" aria-labelledby="skills-title">
        <p className="section-label">01 / SKILLS</p><h2 id="skills-title">What I can build.</h2>
        <div className="skills-grid">{capabilities.map(skill => <article className="skill" data-reveal key={skill.title}><h3>{skill.title}</h3><p>{skill.description}</p><p className="skill-tools">{skill.tools}</p><p className="skill-proof">In practice: {skill.proof}</p></article>)}</div>
      </section>
      <section className="work section" id="work" aria-labelledby="work-title">
        <div className="work-heading" data-reveal><div><p className="section-label">02 / SELECTED PROJECTS</p><h2 id="work-title">Built from end to end.</h2></div><p>Explore the projects behind my skills. Each repository includes the code and documentation.</p></div>
        <div className="filters" role="group" aria-label="Filter projects">{filters.map(item => <button type="button" key={item} aria-pressed={filter === item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <p className="sr-only" role="status">{visibleCount} {visibleCount === 1 ? "project" : "projects"} shown</p>
        <div className={`project-grid${filter === "All" ? " all-projects" : filter === "Product" ? " single-project" : ""}`}>{projects.map((project, index) => <article data-reveal className={`project-card${filter !== "All" && project.category !== filter ? " is-filtered" : ""}`} key={project.title}>
          <a className="card-image" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}><Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized={project.image.endsWith(".gif")} /></a>
          <div className="card-content"><p className="project-category">{project.category}</p><h3>{project.title}</h3><p>{project.description}</p>
            <ul className="project-highlights">{project.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
            <p className="project-proof">{evidence[index].note}</p>
            <ul className="stack" aria-label={`${project.title} technologies`}>{project.stack.map(tool => <li key={tool}>{tool}</li>)}</ul>
            <a className="text-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title} source on GitHub`}>View source <span aria-hidden="true">↗</span></a>
            <a className="text-link evidence-link" href={`${project.href}${evidence[index].path}`} target="_blank" rel="noreferrer" aria-label={`${project.title}: ${evidence[index].label}`}>{evidence[index].label} <span aria-hidden="true">↗</span></a>
          </div>
        </article>)}</div>
      </section>
      <section className="about section" data-reveal id="about" aria-labelledby="about-title">
        <div><p className="section-label">03 / BACKGROUND</p><h2 id="about-title">The whole workflow matters.</h2></div>
        <div><p>I focus on the pieces that turn an idea into a usable system: data handling, decision logic, APIs, telemetry, testing, and the interface people use.</p><dl className="background-details"><div><dt>Education</dt><dd>BML Munjal University<br />B.Tech in Computer Science · Expected May 2027</dd></div><div><dt>Format</dt><dd>On-site or hybrid in India · Flexible duration</dd></div><div><dt>Start date</dt><dd>To be discussed</dd></div><div><dt>Looking for</dt><dd>Internships in computer vision, applied AI, Python systems, and security engineering.</dd></div></dl></div>
      </section>
      <section className="contact section" data-reveal id="contact" aria-labelledby="contact-title">
        <div><p className="section-label">04 / CONTACT</p><h2 id="contact-title">Let’s build something useful.</h2><p>Have a role or a project that fits? I’d like to hear about it.</p></div>
        <div className="contact-links"><a className="contact-email" href={contactHref}>{email} <span aria-hidden="true">↗</span></a><div><a href={`mailto:${email}?subject=Computer%20vision%20internship%20opportunity`}>AI / CV internship ↗</a><a href={`mailto:${email}?subject=Security%20engineering%20internship%20opportunity`}>Security internship ↗</a></div><p className="contact-format">India · On-site / hybrid · Flexible duration</p></div>
      </section>
    </main>
    <footer><span>© {new Date().getFullYear()} Anant Goel</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
