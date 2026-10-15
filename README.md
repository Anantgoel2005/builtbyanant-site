# Built by Anant

The source for [builtbyanant.site](https://builtbyanant.site), my personal portfolio for applied AI, computer vision, security engineering, and full-stack systems.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Production

```bash
npm run build
npm start
```

## Stack

- Next.js and React
- TypeScript
- Anime.js
- Responsive CSS

Project screenshots and demonstrations are sourced from their respective repositories.

## Résumé view

The homepage presents skills, project contributions, education, and contact details.
The primary action downloads a one-page PDF directly. Focused computer-vision
and security-engineering versions are linked beside it. **Print this page**
remains available as a secondary action.
The print layout includes all projects regardless of the selected on-screen filter,
and omits screenshots, navigation, and buttons. Disable browser headers and footers
for a clean export. Project details live in `app/page.tsx`; layout and print styles
live in `app/globals.css`.

The downloadable PDFs are committed in `public/resume/`: software engineering,
computer vision, security engineering, IoT/robotics software, and a three-page
master with 12 selected projects. The IoT and master versions include the Bodycast
internship, based on the owner's LinkedIn screenshots (May-July 2025). To regenerate:

```bash
python -m pip install reportlab pypdf
python scripts/generate_resumes.py
```

All versions share a conventional single-column resume layout with Times-style
type, black text, standard section headings, thin divider rules, and selectable
text. Contacts and source links remain clickable. Focused versions use one page;
the master uses three pages with name and page-number footers.

Use `--only Anant_Goel_IoT_Robotics_Intern_Resume.pdf` (or another filename)
to regenerate one document. The source distinguishes virtual sensor simulations,
device-facing server software, and experimental research from deployed hardware
or measured real-world accuracy. Internship facts come from the owner; project
claims are based on the linked repositories.

Update the verified education, availability, skills, and project copy in that
script when details change. Résumé dates and personal details should match
the homepage. The generator checks that focused resumes fit one page, the master
fits three pages, and required education, project, and experience text is present.

## Search metadata

The static export includes `robots.txt`, `sitemap.xml`, homepage ProfilePage/Person
JSON-LD, and a separate canonical URL for the existing PathWise page. Search
Console verification and sitemap submission require the domain owner's account;
shipping these files does not itself confirm that Google has indexed the site.
