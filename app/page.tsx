"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import Image from "next/image";
type Project = {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  stack: string[];
  href: string;
  demo?: string;
  accent: string;
  image: string;
  alt: string;
  detail: string;
  outcome: string;
};
const projects: Project[] = [
  {
    id: "01",
    title: "Deception Orchestrator",
    type: "Security / Flagship",
    category: "Security",
    description:
      "A self-hostable SOC analyst console for controlled deception labs, turning honeypot and URL-canary activity into MITRE ATT&CK-tagged investigations.",
    stack: ["Python", "FastAPI", "Next.js", "Docker"],
    href: "https://github.com/Anantgoel2005/deception-orchestrator",
    accent: "DEFENSE",
    image: "/projects/deception.png",
    alt: "Deception Orchestrator live security telemetry dashboard",
    detail:
      "Signals become an evidence trail, enriched with ATT&CK context and presented through an operator-first investigation surface.",
    outcome: "Evidence-first investigations with explicit scope and ATT&CK context.",
  },
  {
    id: "02",
    title: "Mouseion",
    type: "Local-first / Product",
    category: "Product",
    description:
      "A private, offline desktop library for PDF and EPUB collections—with reading progress, favorites, metadata, and no cloud dependency.",
    stack: ["TypeScript", "React", "Electron", "Vite"],
    href: "https://github.com/Anantgoel2005/Mouseion",
    accent: "PRIVATE",
    image: "/projects/mouseion-library.png",
    alt: "Mouseion private offline library collection interface",
    detail:
      "A personal library treated as durable local data: fast search, calm reading workflows, and zero dependency on a remote account.",
    outcome: "A private reading workflow that remains useful without an account or network.",
  },
  {
    id: "03",
    title: "Traffic Intelligence",
    type: "Applied AI / Vision",
    category: "Vision",
    description:
      "Real-time traffic analytics that detects and tracks road activity, records incidents, and streams operational telemetry to a live dashboard.",
    stack: ["Python", "YOLO", "ByteTrack", "React"],
    href: "https://github.com/Anantgoel2005/traffic_monitoring_system",
    accent: "REALTIME",
    image: "/projects/traffic-overview.jpg",
    alt: "Traffic Intelligence product overview and live monitoring dashboard",
    detail:
      "A complete perception loop joins detection, persistent tracks, event logic, storage, and a live operational view for traffic teams.",
    outcome: "Turns road footage into trackable events and live operational telemetry.",
  },
  {
    id: "04",
    title: "PathWise",
    type: "Computer Vision / Safety",
    category: "Vision",
    description:
      "A road-safety vision pipeline combining object detection, bird’s-eye-view telemetry, and behaviour signals to identify emerging hazards.",
    stack: ["OpenCV", "YOLOv10", "ByteTrack"],
    href: "https://github.com/Anantgoel2005/PathWise",
    accent: "VISION",
    image: "/projects/pathwise-demo.gif",
    alt: "Animated PathWise hazard-engine telemetry demonstration",
    detail:
      "Perspective-aware tracking converts road footage into interpretable motion and proximity signals for earlier hazard awareness.",
    outcome: "Makes spatial risk understandable through bird’s-eye-view telemetry.",
  },
  {
    id: "05",
    title: "Pentest Agent",
    type: "Security / CLI",
    category: "Security",
    description:
      "A safety-oriented web assessment tool with explicit scope controls, evidence-first verification, and deterministic reporting.",
    stack: ["Python", "HTTPX", "Click", "CI/CD"],
    href: "https://github.com/Anantgoel2005/pentest-agent",
    accent: "SCOPED",
    image: "/projects/pentest.svg",
    alt: "Pentest Agent scope, assess, verify, and report workflow",
    detail:
      "Every action stays inside declared scope. Findings require evidence, and reports remain reproducible enough for a human reviewer to trust.",
    outcome: "Produces reproducible findings while keeping every action inside declared scope.",
  },
  {
    id: "06",
    title: "Internwise",
    type: "Career Intelligence / Product",
    category: "Product",
    description:
      "An internship and PSU opportunity scouter that scores role fit, recommends career preferences, and creates tailored resumes from a candidate’s profile and GitHub work.",
    stack: ["TypeScript", "React", "Cloudflare", "D1"],
    href: "https://github.com/Anantgoel2005/internwise",
    demo: "https://internwise.builtbyanant.site",
    accent: "LIVE",
    image: "/projects/internwise.png",
    alt: "Internwise internship discovery and resume tailoring interface",
    detail:
      "A candidate-first workflow that connects opportunity discovery, explainable match scoring, GitHub-informed recommendations, and internship-specific resume generation.",
    outcome: "Connects discovery, fit scoring, and tailored applications in one workflow.",
  },
];
const commands = [
  { label: "Selected systems", hint: "Jump to projects", action: "projects" },
  { label: "Systems map", hint: "Explore connections", action: "systems" },
  {
    label: "GitHub telemetry",
    hint: "View live activity",
    action: "telemetry",
  },
  { label: "Open GitHub", hint: "External link", action: "github" },
  { label: "Open LinkedIn", hint: "External link", action: "linkedin" },
  { label: "Send a signal", hint: "Email Anant", action: "email" },
];
function Magnetic({
  children,
  href,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: React.PointerEvent) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current?.getBoundingClientRect();
    if (r)
      animate(ref.current!, {
        x: (e.clientX - r.left - r.width / 2) * 0.18,
        y: (e.clientY - r.top - r.height / 2) * 0.18,
        duration: 260,
        ease: "out(3)",
      });
  };
  return (
    <a
      ref={ref}
      className={`magnetic ${className}`}
      href={href}
      onPointerMove={move}
      onPointerLeave={() =>
        animate(ref.current!, { x: 0, y: 0, duration: 500, ease: "out(4)" })
      }
    >
      {children}
    </a>
  );
}
export default function Home() {
  const root = useRef<HTMLElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState("All"),
    [modal, setModal] = useState<Project | null>(null),
    [palette, setPalette] = useState(false),
    [query, setQuery] = useState(""),
    [cursor, setCursor] = useState("EXPLORE"),
    [terminal, setTerminal] = useState("status"),
    [egg, setEgg] = useState(false),
    [progress, setProgress] = useState(0);
  const [github, setGithub] = useState({
    repos: "—",
    stars: "—",
    events: "—",
    updated: "SYNCING",
  });
  const filtered = useMemo(
      () => projects.filter((p) => filter === "All" || p.category === filter),
      [filter],
    ),
    visibleCommands = commands.filter((c) =>
      (c.label + c.hint).toLowerCase().includes(query.toLowerCase()),
    );
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      animate(".hero-line", {
        y: ["115%", "0%"],
        opacity: [0, 1],
        delay: stagger(130, { start: 180 }),
        duration: 1100,
        ease: "out(4)",
      });
      animate(".intro-fade", {
        opacity: [0, 1],
        y: [18, 0],
        delay: stagger(90, { start: 700 }),
        duration: 800,
        ease: "out(3)",
      });
      animate(".core", {
        rotate: "1turn",
        duration: 18000,
        loop: true,
        ease: "linear",
      });
      animate(".core-orbit.reverse", {
        rotate: "-1turn",
        duration: 12000,
        loop: true,
        ease: "linear",
      });
    }
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target, {
              opacity: [0, 1],
              y: [46, 0],
              duration: 800,
              ease: "out(4)",
            });
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    const scroll = () =>
      setProgress(
        Math.min(
          100,
          (scrollY / (document.documentElement.scrollHeight - innerHeight)) *
            100,
        ),
      );
    addEventListener("scroll", scroll, { passive: true });
    const keys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
      if (e.key === "Escape") {
        setPalette(false);
        setModal(null);
      }
      if (e.key.toLowerCase() === "a" && e.shiftKey) setEgg(true);
    };
    addEventListener("keydown", keys);
    Promise.all([
      fetch(
        "https://api.github.com/users/Anantgoel2005/repos?per_page=100",
      ).then((r) => r.json()),
      fetch(
        "https://api.github.com/users/Anantgoel2005/events/public?per_page=30",
      ).then((r) => r.json()),
    ])
      .then(([repos, events]) => {
        if (Array.isArray(repos))
          setGithub({
            repos: String(repos.length),
            stars: String(
              repos.reduce(
                (n: number, r: { stargazers_count: number }) =>
                  n + r.stargazers_count,
                0,
              ),
            ),
            events: Array.isArray(events) ? String(events.length) : "—",
            updated: "LIVE / PUBLIC API",
          });
      })
      .catch(() => setGithub((v) => ({ ...v, updated: "CACHE / OFFLINE" })));
    return () => {
      observer.disconnect();
      removeEventListener("scroll", scroll);
      removeEventListener("keydown", keys);
    };
  }, []);
  useEffect(() => {
    const c = canvas.current;
    if (!c || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    let raf = 0,
      points: { x: number; y: number; vx: number; vy: number }[] = [];
    const size = () => {
      c.width = innerWidth * devicePixelRatio;
      c.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      points = Array.from(
        { length: Math.min(65, Math.floor(innerWidth / 18)) },
        () => ({
          x: Math.random() * innerWidth,
          y: Math.random() * innerHeight,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
        }),
      );
    };
    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      points.forEach((p, i) => {
        p.x = (p.x + p.vx + innerWidth) % innerWidth;
        p.y = (p.y + p.vy + innerHeight) % innerHeight;
        ctx.fillStyle = "rgba(98,255,226,.38)";
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j],
            d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 105) {
            ctx.strokeStyle = `rgba(98,255,226,${0.085 * (1 - d / 105)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };
    size();
    addEventListener("resize", size);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
    };
  }, []);
  const run = (a: string) => {
    setPalette(false);
    if (["projects", "systems", "telemetry"].includes(a))
      document.getElementById(a)?.scrollIntoView({ behavior: "smooth" });
    if (a === "github") open("https://github.com/Anantgoel2005", "_blank");
    if (a === "linkedin")
      open("https://www.linkedin.com/in/ag25goel/", "_blank");
    if (a === "email") open("mailto:anantgoel2005@gmail.com", "_self");
  };
  const track = (e: React.PointerEvent<HTMLElement>) => {
    root.current?.style.setProperty("--mx", `${e.clientX}px`);
    root.current?.style.setProperty("--my", `${e.clientY}px`);
  };
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--rx",
      `${-(e.clientY - r.top - r.height / 2) / 28}deg`,
    );
    e.currentTarget.style.setProperty(
      "--ry",
      `${(e.clientX - r.left - r.width / 2) / 38}deg`,
    );
  };
  return (
    <main ref={root} onPointerMove={track}>
      <a className="skip-link" href="#projects">
        Skip to selected work
      </a>
      <canvas ref={canvas} className="particle-field" aria-hidden="true" />
      <div className="cursor-glow" />
      <div className="custom-cursor">
        <i />
        <span>{cursor}</span>
      </div>
      <div className="telemetry-rail">
        <span style={{ height: `${progress}%` }} />
        <b>{Math.round(progress).toString().padStart(3, "0")}</b>
      </div>
      <nav>
        <a className="identity" href="#top">
          <span className="sigil">AG</span>
          <span>ANANT.GOEL</span>
        </a>
        <div className="nav-center">
          <span className="pulse" /> AVAILABLE FOR OPPORTUNITIES
        </div>
        <div className="nav-links">
          <button
            onClick={() => setPalette(true)}
            aria-label="Open navigation palette"
            aria-expanded={palette}
            aria-controls="command-palette"
          >
            ⌘K
          </button>
          <a href="#projects">PROJECTS</a>
          <a href="#about">ABOUT</a>
          <a href="mailto:anantgoel2005@gmail.com">CONTACT ↗</a>
        </div>
      </nav>
      <section className="hero" id="top">
        <div className="hero-kicker intro-fade">
          <span>PORTFOLIO / 2026</span>
          <span>INDIA · 20.5937° N</span>
        </div>
        <div className="hero-title">
          <div className="line-mask">
            <span className="hero-line">ENGINEERING</span>
          </div>
          <div className="line-mask offset">
            <span className="hero-line outline">INTELLIGENT</span>
          </div>
          <div className="line-mask">
            <span className="hero-line">
              SYSTEMS<span className="dot">.</span>
            </span>
          </div>
        </div>
        <div className="core-wrap intro-fade">
          <div className="core">
            <span className="core-orbit" />
            <span className="core-orbit reverse" />
            <i />
          </div>
          <span className="core-label">
            SYSTEMS
            <br />
            ONLINE
          </span>
        </div>
        <div className="hero-footer intro-fade">
          <div className="hero-summary">
            <p>
              I turn applied AI, computer vision, and security ideas into
              dependable products—from the first experiment to the interface
              people actually use.
            </p>
            <div className="hero-actions">
              <Magnetic href="#projects">VIEW SELECTED WORK ↓</Magnetic>
              <Magnetic href="mailto:anantgoel2005@gmail.com">START A CONVERSATION ↗</Magnetic>
            </div>
          </div>
          <div className="hero-availability">
            <span className="pulse" />
            <span>OPEN TO INTERNSHIPS, RESEARCH &amp; COLLABORATION</span>
          </div>
        </div>
        <div className="hero-index">A—01</div>
      </section>
      <section className="signal-strip" aria-label="Portfolio highlights">
        <div><strong>06</strong><span>COMPLETE SYSTEMS</span></div>
        <div><strong>03</strong><span>CORE PRACTICES</span></div>
        <div><strong>LIVE</strong><span>DEPLOYED PRODUCTS</span></div>
        <div><strong>INDIA</strong><span>AVAILABLE REMOTELY</span></div>
      </section>
      <section className="terminal reveal">
        <div className="terminal-top">
          <span>ANANT://INTERFACE</span>
          <span>SESSION 01</span>
          <i />
        </div>
        <div className="terminal-body">
          <div className="terminal-menu">
            {["status", "stack", "contact"].map((x) => (
              <button
                className={terminal === x ? "active" : ""}
                onClick={() => setTerminal(x)}
                key={x}
              >
                /{x}
              </button>
            ))}
          </div>
          <pre>
            {terminal === "status"
              ? "> SYSTEMS ENGINEER\n> BUILD MODE: END-TO-END\n> AVAILABILITY: OPEN"
              : terminal === "stack"
                ? "> PYTHON / TYPESCRIPT\n> VISION / SECURITY / AI\n> PRODUCT / INFRASTRUCTURE"
                : "> CHANNEL: EMAIL\n> NETWORK: LINKEDIN\n> SOURCE: GITHUB"}
            <span className="terminal-caret">_</span>
          </pre>
        </div>
      </section>
      <section className="manifesto reveal" id="about">
        <div className="section-code">/ APPROACH</div>
        <p>
          I build complete workflows around models—not isolated demos.{" "}
          <span>Understandable at the core. Useful at the edge.</span>
        </p>
        <div className="metrics">
          <div>
            <strong>AI</strong>
            <span>Models → Products</span>
          </div>
          <div>
            <strong>CV</strong>
            <span>Pixels → Decisions</span>
          </div>
          <div>
            <strong>SEC</strong>
            <span>Signals → Evidence</span>
          </div>
        </div>
      </section>
      <section className="systems-map reveal" id="systems">
        <div className="map-copy">
          <span className="section-code">/ SYSTEMS MAP</span>
          <h2>
            ONE PRACTICE.
            <br />
            THREE SIGNAL PATHS.
          </h2>
          <p>
            Hover a node to trace how perception, evidence, and product thinking
            converge in the work.
          </p>
        </div>
        <div className="map-stage">
          {[
            {
              x: 50,
              y: 12,
              t: "INTELLIGENCE",
              d: "Models that turn signal into decisions",
            },
            {
              x: 16,
              y: 72,
              t: "VISION",
              d: "Pixels translated into spatial context",
            },
            {
              x: 84,
              y: 72,
              t: "SECURITY",
              d: "Evidence designed for human trust",
            },
            {
              x: 50,
              y: 50,
              t: "PRODUCT",
              d: "Dependable systems people can use",
            },
          ].map((n, i) => (
            <button
              key={n.t}
              className={`map-node n${i}`}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <b>{n.t}</b>
              <span>{n.d}</span>
            </button>
          ))}
          <i className="map-line l1" />
          <i className="map-line l2" />
          <i className="map-line l3" />
        </div>
      </section>
      <section className="projects" id="projects">
        <header className="section-header reveal">
          <div>
            <span className="section-code">/ SELECTED SYSTEMS</span>
            <h2>
              BUILT FOR
              <br />
              THE REAL WORLD
            </h2>
          </div>
          <span>
            [ {filtered.length.toString().padStart(2, "0")} PROJECTS ]
          </span>
        </header>
        <div className="filters reveal">
          {["All", "Security", "Vision", "Product"].map((x) => (
              <button
                className={filter === x ? "active" : ""}
                onClick={() => setFilter(x)}
                aria-pressed={filter === x}
                key={x}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="project-list">
          {filtered.map((p, index) => (
            <article
              className="project project-enter"
              style={{ animationDelay: `${index * 55}ms` }}
              onPointerMove={tilt}
              onPointerLeave={(e) => {
                e.currentTarget.style.setProperty("--rx", "0deg");
                e.currentTarget.style.setProperty("--ry", "0deg");
                setCursor("EXPLORE");
              }}
              onPointerEnter={() => setCursor("VIEW / " + p.id)}
              key={p.id}
            >
              <div className="project-id">
                {p.id}
                <span>{p.accent}</span>
              </div>
              <div className="project-main">
                <span className="project-type">{p.type}</span>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                <p className="project-outcome"><span>OUTCOME</span>{p.outcome}</p>
                <div className="project-stack">
                  {p.stack.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </div>
                <div className="project-actions">
                  {p.demo && (
                    <a
                      className="live-site"
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      OPEN LIVE SITE ↗
                    </a>
                  )}
                  <button className="inspect" onClick={() => setModal(p)}>
                    VIEW DETAILS →
                  </button>
                  <a
                    className="source-link"
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    SOURCE ↗
                  </a>
                </div>
              </div>
              <figure className="project-visual">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 38vw"
                />
                <figcaption>
                  <span>LIVE ARTIFACT</span>
                  <span>VIEW / 0{p.id}</span>
                </figcaption>
              </figure>
              <a
                className="project-arrow"
                aria-label={`Open ${p.title}${p.demo ? " live demo" : " on GitHub"}`}
                href={p.demo ?? p.href}
                target="_blank"
                rel="noreferrer"
              >
                {p.demo ? "LIVE ↗" : "CODE ↗"}
              </a>
              <div className="project-scan" />
            </article>
          ))}
        </div>
        <a
          className="all-projects reveal"
          href="https://github.com/Anantgoel2005?tab=repositories"
          target="_blank"
          rel="noreferrer"
        >
          <span>EXPLORE ALL REPOSITORIES</span>
          <i>GITHUB ↗</i>
        </a>
      </section>
      <section className="github-grid reveal" id="telemetry">
        <div>
          <span className="section-code">/ LIVE GITHUB TELEMETRY</span>
          <h2>
            PUBLIC
            <br />
            ACTIVITY FEED
          </h2>
          <p>
            Current public repository signals, fetched directly from GitHub when
            this page loads.
          </p>
          <span className="sync">● {github.updated}</span>
        </div>
        <div className="stat-grid">
          <div>
            <strong>{github.repos}</strong>
            <span>PUBLIC REPOS</span>
          </div>
          <div>
            <strong>{github.stars}</strong>
            <span>TOTAL STARS</span>
          </div>
          <div>
            <strong>{github.events}</strong>
            <span>RECENT EVENTS</span>
          </div>
          <a
            href="https://github.com/Anantgoel2005"
            target="_blank"
            rel="noreferrer"
          >
            OPEN PROFILE ↗
          </a>
        </div>
      </section>
      <section className="protocol reveal">
        <div className="section-code">/ OPERATING PRINCIPLES</div>
        <div className="protocol-grid">
          <div>
            <span>01</span>
            <h4>END TO END</h4>
            <p>
              Complete systems around models, not notebooks left in isolation.
            </p>
          </div>
          <div>
            <span>02</span>
            <h4>DETERMINISTIC CORE</h4>
            <p>
              AI where it improves decisions, with understandable behavior
              underneath.
            </p>
          </div>
          <div>
            <span>03</span>
            <h4>PRIVACY FIRST</h4>
            <p>
              Local-first architecture when reliability and ownership matter.
            </p>
          </div>
        </div>
      </section>
      <footer>
        <div className="footer-signal">
          <span className="pulse" /> OPEN CHANNEL
        </div>
        <h2>
          LET’S BUILD
          <br />
          <span>WHAT’S NEXT.</span>
        </h2>
        <div className="footer-actions">
          <Magnetic href="mailto:anantgoel2005@gmail.com">EMAIL ↗</Magnetic>
          <Magnetic href="https://github.com/Anantgoel2005">GITHUB ↗</Magnetic>
          <Magnetic href="https://www.linkedin.com/in/ag25goel/">
            LINKEDIN ↗
          </Magnetic>
        </div>
        <div className="footer-meta">
          <span>© 2026 ANANT GOEL</span>
          <span>SHIFT + A / HIDDEN CHANNEL</span>
          <a href="#top">RETURN TO TOP ↑</a>
        </div>
      </footer>
      {palette && (
        <div className="overlay" onMouseDown={() => setPalette(false)}>
          <div
            className="palette"
            id="command-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Navigate portfolio"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="palette-input">
              <span>⌘</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Route to a system…"
              />
            </div>
            {visibleCommands.map((c, i) => (
              <button key={c.action} onClick={() => run(c.action)}>
                <span>0{i + 1}</span>
                <b>{c.label}</b>
                <i>{c.hint}</i>
              </button>
            ))}
            <footer>
              <span>SELECT A ROUTE</span>
              <span>ESC CLOSE</span>
            </footer>
          </div>
        </div>
      )}
      {modal && (
        <div className="overlay" onMouseDown={() => setModal(null)}>
          <article
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setModal(null)}>
              CLOSE ×
            </button>
            <span className="section-code">
              / SYSTEM {modal.id} · {modal.accent}
            </span>
            <Image
              src={modal.image}
              alt={modal.alt}
              width={1200}
              height={700}
              sizes="(max-width: 900px) 94vw, 850px"
            />
            <h2 id="project-modal-title">{modal.title}</h2>
            <p>{modal.detail}</p>
            <div className="modal-outcome">
              <span>OUTCOME</span>
              <p>{modal.outcome}</p>
            </div>
            <div className="project-stack">
              {modal.stack.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
            {modal.demo && (
              <a href={modal.demo} target="_blank" rel="noreferrer">
                OPEN LIVE DEMO ↗
              </a>
            )}
            <a href={modal.href} target="_blank" rel="noreferrer">
              OPEN SOURCE ↗
            </a>
          </article>
        </div>
      )}
      {egg && (
        <div className="egg" onClick={() => setEgg(false)}>
          <div>
            <span>UNLISTED SIGNAL / A—25</span>
            <h2>
              CURIOSITY
              <br />
              IS A FEATURE.
            </h2>
            <p>
              You found the hidden channel. The best systems reward exploration.
            </p>
            <button>RETURN TO NETWORK</button>
          </div>
        </div>
      )}
    </main>
  );
}
