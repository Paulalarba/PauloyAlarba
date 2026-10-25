# Paul Alarba portfolio

A React/Vite portfolio with a cream, navy, and blue visual system, a desktop profile sidebar, and floating mobile navigation.

## Run locally

```powershell
npm install
npm run dev
```

Build with `npm run build`, then use `npm run preview` to inspect the production output.

## Structure

- `src/App.jsx`: clean path navigation, page titles, focus management, and persisted theme.
- `src/data/portfolio.js`: projects, skills, education, asset paths, and contact links.
- `src/components/PortfolioShell.jsx`: profile sidebar and mobile navigation.
- `src/components/HomePage.jsx`: tools marquee and bento homepage.
- `src/components/BitcoinCard.jsx`: local animation and reduced-motion fallback.
- `src/components/CursorRing.jsx`: decorative cursor follower for fine mouse pointers.
- `src/components/PortfolioPages.jsx`: Projects, Expertise, About, Contact, and accessible native project dialogs.
- `src/components/ContactForm.jsx`: validated email-draft form.
- `src/styles/site.css`: shared tokens, components, dark theme, and responsive layouts.
- `public/Public/`: local images, Bitcoin video, poster, and résumé.

Navigation uses `/`, `/projects`, `/expertise`, `/about`, and `/contact`. Vite handles direct routes locally; a static host must rewrite these paths to `index.html`. Old `#home`, `#top`, `#work`, and `#education` links redirect to the equivalent clean path. A project can be linked directly with `/projects?project=sugbogo` (also `fittrack`, `sitin`, or `sportsstore`).

The site uses system fonts and inline SVG icons. SportsStore retains its original hosted screenshot, with a project placeholder if that image cannot load. Other featured assets are local.

The contact form opens the visitor's email application with a draft; it does not send mail through a server. Repository buttons point to GitHub and are not labeled as live demos.

Earlier hero and legacy components remain in the project but are not loaded by the redesigned application.

## Workflow introduction

Each fresh homepage load plays an animated Idea / Build / Connect / Ready workflow. The headline reveals word by word and moves into its real homepage position as the sidebar and bento cards appear. The Bitcoin video waits until the intro finishes.

The HTML opening frame shows a brief geometric signal while React loads; the headline appears once in the React introduction. The intro supports Escape, keyboard focus containment, saved dark mode, and reduced motion. It skips direct inner-page visits and viewports shorter than 480px. Navigation within the app does not restart the intro. It waits only for opening images, accepts image errors as settled, and exits after a bounded wait. If the application bundle cannot start, the HTML shell offers a reload fallback.

- `src/components/WorkflowIntro.jsx`: visual sequence, headline measurement, and accessibility.
- `src/components/intro/introModel.js`: timing, visit policy, and placement calculations.
- `src/components/intro/introTimeline.js`: cancellable loading and exit coordination.
- `src/styles/intro.css`: word masks, workflow signals, and page reveal.
- `tests/intro.test.mjs`: lifecycle, timeout, layout, and bootstrap regression checks.

Run the intro checks with `node --test tests/intro.test.mjs`.
