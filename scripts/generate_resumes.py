"""Generate three one-page resumes from verified portfolio and owner-supplied facts.

Run: python -m pip install reportlab pypdf
     python scripts/generate_resumes.py
Update facts and project copy here before regenerating the committed PDFs.
"""
from pathlib import Path
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

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
    canvas.drawRightString(A4[0] - 44, 27, "builtbyanant.site")
    canvas.restoreState()

def generate():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for filename, role, keys, summary, skills in VARIANTS:
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
    generate()
