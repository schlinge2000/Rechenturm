# Rechenturm

Mathematik zum Anschauen für Grundschüler.

**Live:** https://rechenturm.netlify.app/

Plus-, Minus- und Mal-Aufgaben (Zahlenraum 0–100) werden auf einem Turm mit
10 Etagen à 10 Stufen visualisiert. Jede Einerstelle bekommt eine feste Farbe
— wer +10 rechnet, landet eine Etage höher auf derselben Farbe.

## Lokal starten

```bash
npm install
npm run dev
```

Die App läuft danach auf http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

`npm run build` schreibt nach `dist/`. Das Verzeichnis ist ein statisches
Bundle und kann auf jedem beliebigen Static-Hoster (GitHub Pages, Netlify,
Vercel, S3, nginx …) ohne Backend deployed werden.

## Tech-Stack

React 18 + TypeScript + Vite. Keine weiteren Runtime-Abhängigkeiten.

