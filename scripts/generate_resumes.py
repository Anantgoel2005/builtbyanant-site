"""Generate focused resumes and a master from verified project and owner facts.

Run: python -m pip install reportlab pypdf
     python scripts/generate_resumes.py
Update facts and project copy here before regenerating the committed PDFs.
"""
from pathlib import Path
import argparse
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "resume"
UPDATED = "15 October 2026"
INK = colors.HexColor("#14211e")
ACCENT = colors.HexColor("#0e6b5b")
styles = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=INK, spaceAfter=5),
    "role": ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=ACCENT, spaceAfter=9),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=14, textColor=INK, spaceAfter=6),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=9, leading=13, textColor=INK, spaceAfter=5),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11, leading=15, textColor=ACCENT, spaceBefore=13, spaceAfter=7),
    "project": ParagraphStyle("project", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=INK, spaceAfter=5),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10, leading=14, leftIndent=11, firstLineIndent=-9, textColor=INK, spaceAfter=4),
}

PROJECTS = {
    "warehouse": ("RFID Smart Warehouse System", "rfid-warehouse-server", "JavaScript, Node.js, Express, SQLite", [
        "Built device-facing REST endpoints for RFID item registration, tag assignment, checkout, and temperature, humidity, gas, and alarm telemetry.",
        "Persisted inventory and sensor events in SQLite with timestamped audit logs and a web dashboard; designed the API for ESP32 devices using RC522, DHT22, and MQ sensors.",
    ]),
    "speednet": ("SpeedNet | Fog-Edge Simulation", "SpeedNet", "Python, Flask, JSON telemetry", [
        "Built deterministic virtual sensor nodes and a fog-layer API to calculate explainable highway speed advisories from weather and traffic observations.",
        "Validated sensor ranges, expired stale nodes, and exposed live status with thread-safe state; added reproducible scenarios and automated tests. Sensor inputs are simulated.",
    ]),
    "insidi": ("Insidi_OS | Insider-Threat Investigation Lab", "Insidi_OS", "FastAPI, Next.js, PostgreSQL, Redis", [
        "Extended Deception Orchestrator with identity-aware detection rules, account filters, and explainable findings for employee data misuse and administrator abuse.",
        "Built a timed showcase with pause, replay, investigation timelines, and synthetic containment; added authenticated sessions, CSRF checks, and browser-workflow validation.",
    ]),
    "quantum": ("Quantum Lunar Edge Detection | FRQI & NEQR Variants", "Quantum_Lunar_Edge_Detection_NEQR", "Python, Qiskit Aer, image processing", [
        "Developed attributed FRQI and NEQR variants of an upstream lunar imaging system, reconstructing intensity differences or quantized boundaries from measured circuit counts.",
        "Integrated tiled inference, halo stitching, gate-checkpoint playback, image uploads, and classical comparison panels; validated encoded states and measured outputs on an ideal simulator.",
    ]),
    "parking": ("ParkingIntel | Hackathon Project", "parkingintel", "Pandas, scikit-learn, Streamlit, Folium", [
        "Built DBSCAN hotspot clustering and a dashboard for parking-violation records, with station, time, weekday, and vehicle-type filters.",
        "Combined spatial maps, temporal charts, station comparisons, and observational gap analysis to help inspect enforcement patterns.",
    ]),
    "pneumonia": ("Chest X-Ray Classification | Educational Prototype", "pneumonia_detection", "PyTorch, Flask, Grad-CAM", [
        "Built a CNN training and inference workflow for normal/pneumonia chest X-ray classification, with automatic CUDA or CPU selection.",
        "Implemented Grad-CAM explanations and an image-upload interface; documented checkpoint requirements and educational, non-clinical scope.",
    ]),
    "internwise": ("Internwise | Internship Discovery & Resume Tools", "internwise", "TypeScript, React, Cloudflare Workers, D1", [
        "Built opportunity discovery, location filtering, role-fit scoring, and GitHub-based resume tailoring in a student-facing web application.",
        "Connected a React interface to Cloudflare Workers and D1 storage using Drizzle ORM, with source URLs and verification timestamps for listings.",
    ]),
    "pathwise": ("PathWise", "PathWise", "Python, YOLO, ByteTrack, OpenCV", [
        "Built a road-risk pipeline with persistent vehicle tracking, calibrated road-plane projection, and explainable time-to-collision and cut-in rules.",
        "Validated a six-second synthetic reference scenario containing 180 frames and 540 actor samples; demo outputs are not real-world perception-accuracy claims.",
    ]),
    "traffic": ("Traffic Intelligence", "traffic_monitoring_system", "Python, YOLO, ByteTrack, React", [
        "Connected road-activity detection and persistent tracking to incident recording and operational telemetry.",
        "Built a React dashboard to make traffic analytics and recorded incidents inspectable in one workflow.",
    ]),
    "deception": ("Deception Orchestrator", "deception-orchestrator", "Python, FastAPI, Next.js, Docker", [
        "Developed a self-hostable analyst console that turns honeypot and URL-canary events into MITRE ATT&CK-tagged investigations.",
        "Connected a FastAPI control plane to a Next.js workspace, with Docker deployment and automated backend tests and frontend builds.",
    ]),
    "mouseion": ("Mouseion", "Mouseion", "TypeScript, React, Electron, Vite", [
        "Built a private PDF and EPUB library with metadata, favorites, and reading progress, without cloud accounts or document uploads.",
        "Packaged a local-first React interface with Electron; added catalogue tests and an Electron smoke test.",
    ]),
    "pentest": ("Pentest Agent", "pentest-agent", "Python, HTTPX, Click, GitHub Actions", [
        "Created an educational CLI for authorized web assessment with explicit scope controls, exact-host boundaries, and bounded request limits.",
        "Added evidence-first verification and deterministic JSON/Markdown reports; maintained CI checks for tests, linting, security auditing, and package builds.",
    ]),
}

VARIANTS = [
    ("Anant_Goel_IoT_Robotics_Intern_Resume.pdf", "IoT / Robotics Software Intern", ["warehouse", "speednet", "pathwise"],
     "Final-year Computer Science student building software for connected devices and perception workflows. Project experience spans RFID inventory APIs, sensor telemetry, fog-edge simulation, vehicle tracking, and explainable road-risk logic.",
     [("Languages", "Python, JavaScript, TypeScript"), ("IoT software", "Device REST APIs, RFID workflows, sensor logging, SQLite"), ("Perception & simulation", "OpenCV, YOLO, ByteTrack, calibrated geometry, virtual sensor nodes"), ("Tools", "Node.js, Express, Flask, Git, automated tests")]),
    ("Anant_Goel_Software_Engineering_Resume.pdf", "Software Engineering | Computer Vision & Python Systems", ["pathwise", "deception", "mouseion"],
     "Final-year Computer Science student building complete workflows around computer vision, defensive security, and local-first products. Focused on data handling, APIs, testing, telemetry, and usable interfaces.",
     [("Languages", "Python, TypeScript"), ("Computer vision", "OpenCV, YOLO, ByteTrack"), ("Applications", "FastAPI, React, Next.js, Electron, Vite"), ("Tools & practices", "Docker, automated tests, GitHub Actions, security telemetry")]),
    ("Anant_Goel_Computer_Vision_Intern_Resume.pdf", "Computer Vision / Applied AI Intern", ["pathwise", "traffic", "deception"],
     "Final-year Computer Science student focused on computer vision and the engineering around it: video pipelines, persistent tracking, calibrated geometry, APIs, dashboards, and reproducible validation.",
     [("Languages", "Python, TypeScript"), ("Computer vision", "OpenCV, YOLO, ByteTrack, calibrated geometry"), ("Backend & interfaces", "FastAPI, React, Next.js"), ("Tools & practices", "Docker, automated tests, GitHub Actions, telemetry")]),
    ("Anant_Goel_Security_Engineering_Intern_Resume.pdf", "Security Engineering / Automation Intern", ["deception", "pentest", "mouseion"],
     "Final-year Computer Science student building defensive security and assessment tooling. Focused on security telemetry, scoped verification, investigation workflows, APIs, and reproducible tests.",
     [("Languages", "Python, TypeScript"), ("Security", "MITRE ATT&CK mapping, honeypot telemetry, scope controls, evidence verification"), ("Backend & interfaces", "FastAPI, HTTPX, Click, React, Next.js"), ("Tools & practices", "Docker, GitHub Actions, automated tests, security auditing")]),
]

def paragraph(text, style="body"):
    return Paragraph(text, styles[style])

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#59615b"))
    canvas.drawString(44, 27, f"Updated {UPDATED}")
    canvas.drawCentredString(A4[0] / 2, 27, str(doc.page))
    canvas.drawRightString(A4[0] - 44, 27, "builtbyanant.site")
    canvas.restoreState()


def project_block(key):
    title, repo, stack, bullets = PROJECTS[key]
    block = [paragraph(f'<link href="https://github.com/Anantgoel2005/{repo}">{escape(title)}</link>', "project"),
             paragraph(escape(stack), "contact")]
    if key == "quantum":
        block.append(paragraph('<link href="https://github.com/Anantgoel2005/Quantum_Lunar_Edge_Detection_FRQI">FRQI source</link> | <link href="https://github.com/Anantgoel2005/Quantum_Lunar_Edge_Detection_NEQR">NEQR source</link>', "contact"))
    block.extend(paragraph("- " + escape(bullet), "bullet") for bullet in bullets)
    block.append(Spacer(1, 7))
    return KeepTogether(block)


def generate_master():
    path = OUTPUT / "Anant_Goel_Master_Resume.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=44, leftMargin=44,
                            topMargin=36, bottomMargin=40,
                            title="Anant Goel - Master Resume", author="Anant Goel")
    flow = [paragraph("ANANT GOEL", "name"),
            paragraph("Software Engineering | Applied AI | IoT Systems | Security", "role"),
            paragraph('<link href="mailto:anantgoel2005@gmail.com">anantgoel2005@gmail.com</link> | India', "contact"),
            paragraph('<link href="https://builtbyanant.site">builtbyanant.site</link> | <link href="https://github.com/Anantgoel2005">github.com/Anantgoel2005</link> | <link href="https://www.linkedin.com/in/ag25goel/">linkedin.com/in/ag25goel</link>', "contact"),
            paragraph("PROFILE", "section"),
            paragraph("Final-year Computer Science student building complete software workflows across computer vision, security, connected-device services, and offline products. Experience includes a two-month industry internship and project work spanning APIs, data pipelines, explainable decision logic, dashboards, and reproducible validation."),
            paragraph("EDUCATION", "section"),
            paragraph("<b>BML Munjal University</b> | B.Tech in Computer Science | Expected May 2027"),
            paragraph("WORK EXPERIENCE", "section"),
            paragraph("<b>Bodycast Innovators Pvt. Ltd.</b> | Internship | 2 months"),
            paragraph("TECHNICAL SKILLS", "section")]
    skills = [
        ("Languages", "Python, JavaScript, TypeScript, SQL"),
        ("AI & perception", "OpenCV, YOLO, ByteTrack, PyTorch, Grad-CAM, calibrated geometry"),
        ("Backend & data", "FastAPI, Flask, Node.js, Express, PostgreSQL, Redis, SQLite"),
        ("Interfaces & deployment", "React, Next.js, Electron, Streamlit, Docker, Cloudflare Workers / D1"),
        ("Specialized project tools", "Qiskit Aer, Pandas, scikit-learn, RFID device APIs, fog-edge simulation"),
        ("Engineering practices", "Automated tests, GitHub Actions, telemetry, scoped security verification"),
    ]
    for label, value in skills:
        flow.append(paragraph(f"<b>{escape(label)}:</b> {escape(value)}"))
    flow.append(paragraph("FEATURED PROJECTS", "section"))
    flow.extend(project_block(key) for key in ("pathwise", "insidi"))
    flow.extend([PageBreak(), paragraph("ANANT GOEL | MASTER RESUME", "role"),
                 paragraph("COMPUTER VISION, IoT & APPLIED RESEARCH", "section")])
    flow.extend(project_block(key) for key in ("warehouse", "speednet", "traffic", "quantum", "pneumonia"))
    flow.extend([PageBreak(), paragraph("ANANT GOEL | MASTER RESUME", "role"),
                 paragraph("SECURITY, PRODUCTS & DATA APPLICATIONS", "section")])
    flow.extend(project_block(key) for key in ("deception", "pentest", "mouseion", "internwise", "parking"))
    flow.extend([paragraph("INTERNSHIP PREFERENCES", "section"),
                 paragraph("On-site / hybrid roles in India. Flexible duration; start date to be discussed.")])
    doc.build(flow, onFirstPage=footer, onLaterPages=footer)
    reader = PdfReader(path)
    text = "\n".join(page.extract_text() for page in reader.pages)
    for required in ("Bodycast Innovators", "May 2027", *(project[0] for project in PROJECTS.values())):
        if required not in text:
            raise ValueError(f"Missing {required} in master resume")
    if len(reader.pages) != 3:
        raise ValueError(f"Master resume: expected 3 pages, got {len(reader.pages)}")
    print(f"{path.name}: {len(reader.pages)} pages; all {len(PROJECTS)} projects and work experience present")

def generate(selected=None):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for filename, role, keys, summary, skills in VARIANTS:
        if selected and filename not in selected:
            continue
        path = OUTPUT / filename
        doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=44, leftMargin=44, topMargin=36, bottomMargin=40,
                                title=f"Anant Goel - {role}", author="Anant Goel")
        flow = [paragraph("ANANT GOEL", "name"), paragraph(escape(role), "role"),
                paragraph('<link href="mailto:anantgoel2005@gmail.com">anantgoel2005@gmail.com</link> | India', "contact"),
                paragraph('<link href="https://builtbyanant.site">builtbyanant.site</link> | <link href="https://github.com/Anantgoel2005">github.com/Anantgoel2005</link> | <link href="https://www.linkedin.com/in/ag25goel/">linkedin.com/in/ag25goel</link>', "contact"),
                paragraph("SUMMARY", "section"), paragraph(escape(summary)),
                paragraph("EDUCATION & AVAILABILITY", "section"),
                paragraph("<b>BML Munjal University</b> | B.Tech in Computer Science | Expected May 2027"),
                paragraph("Seeking on-site / hybrid internships in India. Flexible duration; start date to be discussed."),
                paragraph("TECHNICAL SKILLS", "section")]
        for label, value in skills:
            flow.append(paragraph(f"<b>{escape(label)}:</b> {escape(value)}"))
        flow.append(paragraph("SELECTED PROJECTS", "section"))
        for key in keys:
            title, repo, stack, bullets = PROJECTS[key]
            block = [paragraph(f'<link href="https://github.com/Anantgoel2005/{repo}">{escape(title)}</link> <font name="Helvetica" size="9">| {escape(stack)}</font>', "project")]
            block.extend(paragraph("- " + escape(bullet), "bullet") for bullet in bullets)
            block.append(Spacer(1, 7))
            flow.append(KeepTogether(block))
        doc.build(flow, onFirstPage=footer, onLaterPages=footer)
        reader = PdfReader(path)
        if len(reader.pages) != 1:
            raise ValueError(f"{filename}: expected one page, got {len(reader.pages)}")
        text = reader.pages[0].extract_text()
        for required in ("BML Munjal University", "May 2027", "Anant", "India"):
            if required not in text:
                raise ValueError(f"Missing {required} in {filename}")
        print(f"{filename}: one page; {len(reader.pages[0].get('/Annots', []))} clickable links")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--only", nargs="+", help="Generate only the specified PDF filenames")
    args = parser.parse_args()
    known = {variant[0] for variant in VARIANTS} | {"Anant_Goel_Master_Resume.pdf"}
    if args.only and set(args.only) - known:
        parser.error("Unknown PDF filename: " + ", ".join(sorted(set(args.only) - known)))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    generate(args.only)
    if not args.only or "Anant_Goel_Master_Resume.pdf" in args.only:
        generate_master()
