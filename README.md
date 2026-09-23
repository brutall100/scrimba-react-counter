# Neon Odometer · Scrimba React Counter

A glowing mechanical click counter built with React and Vite. Digits roll into place on odometer wheels while gears turn in the background.

**[▶ Live demo](https://brutall100.github.io/scrimba-react-counter/)** · **[Source code](https://github.com/brutall100/scrimba-react-counter)**

![Neon Odometer in light mode](docs/screenshot.webp)

<p>
  <img src="docs/screenshot-dark.webp" alt="Neon Odometer in dark mode" width="640" height="430">
  <img src="docs/screenshot-mobile.webp" alt="Neon Odometer on a 390px phone screen" width="160" height="697">
</p>

## About

This started as the default "count is 0" button from the Vite + React template, made while I was working through the [Scrimba](https://scrimba.com) React course. I turned it into a small, complete app: a retro-futuristic tally machine that mixes a brass odometer with neon arcade lights.

## Features

- **Rolling odometer**: each digit is a wheel that spins to the new number. Negative numbers get a sign.
- **Step sizes**: count by ×1, ×5 or ×10.
- **Goal meter**: set a target, watch the progress tube fill up, and get a burst of sparks when you reach it.
- **Machine log**: total clicks, best score and goals reached, with numbers that count up.
- **Ticker tape**: the last 8 moves, with times.
- **🌍 World counter**: one number shared by every visitor, stored in [Supabase](https://supabase.com) and updated live when anyone, anywhere clicks. Without Supabase settings it falls back to a demo mode that counts in your browser.
- **Keyboard controls**: `↑` / `+` add, `↓` / `−` subtract, `R` resets.
- **Remembers everything**: count, settings and history are saved in `localStorage`.
- **Live background**: turning gears, drifting brass and violet glows, a neon grid floor and rising digits, all created at random in JavaScript. Only `transform` and `opacity` are animated. Phones get half the particles.
- **Light and dark themes**: follows your system, has a toggle that remembers your choice, and never flashes the wrong theme on load.
- **Accessible**: skip link, visible focus rings, labelled inputs, screen reader announcements, and WCAG AA contrast. `prefers-reduced-motion` turns off all movement.
- **Responsive**: works down to 390px wide with no sideways scrolling.

## Built with

- [React 18](https://react.dev): `useReducer`, `useEffect`, `useRef` and custom hooks
- [Vite 5](https://vitejs.dev): dev server and build
- Plain CSS with custom properties. The whole palette lives in [`src/styles/tokens.css`](src/styles/tokens.css).
- [Supabase](https://supabase.com): Postgres database, Row Level Security and Realtime for the world counter (`@supabase/supabase-js`, loaded only when configured)
- GitHub Actions: builds the site and deploys it to GitHub Pages

### Colour palette

| Role | Light | Dark |
| --- | --- | --- |
| Background | `#EEEDF5` | `#0E0C1C` |
| Surface | `#FFFFFF` | `#181530` |
| Text | `#1B1830` | `#ECE9FF` |
| Brass accent | `#A97A22` (text: `#7A5410`) | `#E0A93B` |
| Neon violet | `#6C2BD9` | `#A57BFF` |
| Neon mint | `#007A63` | `#2EF2C0` |

Every text and background pair I use passes WCAG AA: at least 4.5:1 for text and at least 3:1 for UI parts.

### Fonts

Self-hosted with [Fontsource](https://fontsource.org), all from Google Fonts:

- **Chakra Petch** for headings and buttons
- **IBM Plex Sans** for body text
- **IBM Plex Mono** for the odometer digits and numbers

## What I learned

- How to keep related state in one place with `useReducer`, and how to save it with a small custom hook.
- How to build a rolling odometer with nothing but a CSS `transform` on a strip of digits.
- How to animate a background smoothly: stick to `transform` and `opacity`, use `position: fixed` and `pointer-events: none`, and respect `prefers-reduced-motion`.
- How to set up a design with CSS variables, so a light and dark theme are just two sets of values.
- How to stop the theme flashing on load by setting it in a tiny script before React starts.
- How to deploy a Vite app to GitHub Pages with a `base` path and a GitHub Actions workflow.
- How a static site can still share data: Supabase stores the number, Row Level Security only lets visitors read it, and a `security definer` function is the one way to add +1.
- How to keep secrets out of git with `.env` files, and why a Supabase publishable key is fine in the browser.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
git clone https://github.com/brutall100/scrimba-react-counter.git
cd scrimba-react-counter
npm install
npm run dev
```

Then open the address Vite prints (usually `http://localhost:5173/scrimba-react-counter/`).

Other scripts:

```bash
npm run build    # production build in dist/
npm run preview  # serve the production build
npm run lint     # check the code with ESLint
```

The app runs without any settings. The world counter is then in **demo mode**.

### Connect the world counter (optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor → New query**, paste [`supabase/schema.sql`](supabase/schema.sql) and press **Run**. It creates the table, the security rules, the `increment_world_counter` function and turns on Realtime.
3. Copy the settings file and fill it in:

   ```bash
   cp .env.example .env
   ```

   - `VITE_SUPABASE_URL`: your project URL (`https://<ref>.supabase.co`)
   - `VITE_SUPABASE_KEY`: the **publishable** (or legacy **anon**) key. Never the secret / service_role key.
4. Restart `npm run dev`. The badge should turn **Live**.

### How it works on GitHub Pages vs locally

GitHub Pages only hosts static files. There is no server of my own. The site is built by GitHub Actions and every visitor's browser talks straight to Supabase:

| Where | World counter |
| --- | --- |
| Locally with `.env` | Real, shared, live |
| Locally without `.env` | Demo mode (browser only) |
| GitHub Pages with the two repository secrets set | Real, shared, live |
| GitHub Pages without secrets | Demo mode |

To switch it on for the live site, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` under **Settings → Secrets and variables → Actions → New repository secret**, then re-run the **Deploy to GitHub Pages** workflow.

## Project structure

```
.
├── .github/workflows/deploy.yml   # build and deploy to GitHub Pages
├── docs/                          # README screenshots
├── public/
│   ├── favicon.svg
│   └── theme-init.js              # picks the theme before the page paints
├── src/
│   ├── components/                # odometer, live background, goal meter, ...
│   ├── hooks/                     # persisted reducer, world counter, count-up, reveal, reduced motion
│   ├── lib/                       # counter reducer and gear shape maths
│   ├── styles/
│   │   ├── tokens.css             # colours, fonts and sizes
│   │   └── app.css                # layout and components
│   ├── app.jsx
│   └── main.jsx
├── supabase/schema.sql            # table, security rules and function for the world counter
├── .env.example                   # settings template (copy to .env)
├── index.html
├── package.json
└── vite.config.js
```

## Credits

- Made while following the React course on [Scrimba](https://scrimba.com).
- Started from the official [Vite](https://github.com/vitejs/vite) React template (MIT, © 2019-present VoidZero Inc. and Vite contributors).
- Fonts: Chakra Petch, IBM Plex Sans and IBM Plex Mono, all under the SIL Open Font License, served with Fontsource.

## License

[MIT](LICENSE) © 2026 brutall100
