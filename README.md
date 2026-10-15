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

The downloadable PDFs are committed in `public/resume/`. To regenerate them:

```bash
python -m pip install reportlab pypdf
python scripts/generate_resumes.py
```

Update the verified education, availability, skills, and project copy in that
script when details change. Résumé dates and personal details should match
the homepage. The generator checks that each PDF fits one page and contains
the required education and identity text.

## Search metadata

The static export includes `robots.txt`, `sitemap.xml`, homepage ProfilePage/Person
JSON-LD, and a separate canonical URL for the existing PathWise page. Search
Console verification and sitemap submission require the domain owner's account;
shipping these files does not itself confirm that Google has indexed the site.
