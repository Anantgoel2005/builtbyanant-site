import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PathWise Case Study | Anant Goel",
  description:
    "A transparent road-risk pipeline using persistent tracking, calibrated geometry, and deterministic TTC validation.",
};

const metrics = [
  ["180", "FRAMES / 6-SECOND REFERENCE SCENARIO"],
  ["540", "ACTOR SAMPLES"],
  ["33", "CUT-IN FRAMES"],
  ["2.033s", "MINIMUM TTC"],
];

export default function PathWiseCaseStudy() {
  return (
    <main className="case-study">
      <nav className="case-nav">
        <Link href="/">← BACK TO PORTFOLIO</Link>
        <a href="https://github.com/Anantgoel2005/PathWise" target="_blank" rel="noreferrer">SOURCE ↗</a>
      </nav>
      <header className="case-hero">
        <span className="case-kicker">/ FLAGSHIP CASE STUDY · COMPUTER VISION / SAFETY</span>
        <h1>PATHWISE<span>.</span></h1>
        <p>
          A road-risk pipeline that connects persistent vehicle tracks to calibrated road geometry,
          relative motion, and explainable time-to-collision and cut-in warnings.
        </p>
        <div className="case-actions">
          <a href="https://github.com/Anantgoel2005/PathWise" target="_blank" rel="noreferrer">VIEW SOURCE ↗</a>
          <a href="#evidence">READ VALIDATION ↓</a>
        </div>
      </header>

      <section className="case-image"><img src="/projects/pathwise-demo.gif" alt="PathWise processing road footage with tracked vehicles and risk telemetry" /></section>

      <section className="case-grid">
        <div><span>/ PROBLEM</span><p>Turn a monocular road video into reviewable risk signals instead of an opaque detection overlay.</p></div>
        <div><span>/ CONSTRAINTS</span><p>Distance and TTC depend on camera calibration, stable identities, frame timing, and a flat-road approximation.</p></div>
        <div><span>/ MY CONTRIBUTION</span><p>Designed the risk pipeline, implemented calibrated projection and TTC logic, produced deterministic validation artefacts, and integrated telemetry and the dashboard.</p></div>
        <div><span>/ DEPLOYMENT</span><p>Research and portfolio prototype. It is not a vehicle safety system and must not be the sole basis for operational decisions.</p></div>
      </section>

      <section className="case-section architecture">
        <span className="case-kicker">/ SYSTEM ARCHITECTURE</span>
        <div className="architecture-flow">
          {["CAMERA / ROAD VIDEO", "YOLO DETECTION", "BYTETRACK IDENTITIES", "CALIBRATED BEV HOMOGRAPHY", "RELATIVE MOTION", "TTC + CUT-IN RULES", "VIDEO / CSV / DASHBOARD"].map((step, index) => <div key={step}><b>0{index + 1}</b><span>{step}</span></div>)}
        </div>
        <p className="case-note">The core risk logic is isolated from the detector adapter so the assumptions can be tested deterministically without loading a model.</p>
      </section>

      <section className="case-section" id="evidence">
        <span className="case-kicker">/ DETERMINISTIC VALIDATION</span>
        <h2>MEASURED, NOT IMPLIED.</h2>
        <p className="case-lede">The committed reference scenario runs for six seconds at 30 FPS. These are scenario outputs, not detector-accuracy or real-world latency claims.</p>
        <div className="case-metrics">{metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
      </section>

      <section className="case-section split">
        <div><span className="case-kicker">/ KEY DECISIONS</span><h3>EXPLAINABLE RISK LOGIC.</h3><p>ByteTrack supplies persistent identities. A calibrated homography projects tracks to the road plane; relative longitudinal motion feeds transparent TTC thresholds and lateral cut-in rules.</p></div>
        <div><span className="case-kicker">/ KNOWN LIMITATIONS</span><h3>HONEST SCOPE.</h3><p>No public detector-accuracy, precision/recall, TTC-error, or latency benchmark is claimed. The prototype does not compensate for ego motion, and calibration must be redone whenever the camera geometry changes.</p></div>
      </section>

      <section className="case-section case-evidence"><span className="case-kicker">/ EVIDENCE</span><h2>FOLLOW THE TRAIL.</h2><div><a href="https://github.com/Anantgoel2005/PathWise" target="_blank" rel="noreferrer">SOURCE & DOCUMENTATION ↗</a><a href="https://github.com/Anantgoel2005/PathWise/blob/main/docs/demo-metrics.json" target="_blank" rel="noreferrer">MACHINE-READABLE METRICS ↗</a><a href="https://github.com/Anantgoel2005/PathWise/tree/main/tests" target="_blank" rel="noreferrer">DETERMINISTIC TESTS ↗</a></div></section>
    </main>
  );
}
