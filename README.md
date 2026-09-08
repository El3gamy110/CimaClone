# CimaClone

[![Live Demo](https://img.shields.io/badge/Live%20Demo-🚀-brightgreen)](https://cima-clone.vercel.app/)

CimaClone is a modern, glass‑morphism styled web application for discovering movies and TV series. Built with **React**, **TypeScript**, and **Vite**, it delivers a premium, high‑performance experience with dynamic 3D backgrounds, lazy‑loaded assets, and a fully responsive mobile‑first UI.

---

## ✨ Features
- **Responsive Design** – Seamless experience on desktop, tablet, and mobile. The mobile bottom navigation mirrors desktop primary tabs.
- **3D Animated Background** – A lightweight, lazily‑loaded scene using `React.lazy` & `Suspense`.
- **Hero Sections & Carousels** – Smooth, glass‑styled hero banners and infinite‑scroll carousels for trending content.
- **Watchlist Powered by Supabase** – Authenticated users can save movies/series to a personal watchlist.
- **Image Optimization** – TMDB images are fetched at `w1280` size and all off‑screen images use native `loading="lazy"`.
- **Accessibility** – All interactive elements have appropriate `aria-label`s; keyboard navigation is fully supported.
- **Performance‑First** – Code‑splitting, lazy loading, and removal of heavy dependencies (e.g., `recharts`) keep the bundle under 500 KB gzipped.
- **State Management** – Simple, powerful state handled by **Zustand**.

---

## 🚀 Live Demo
Check the app in action: **[https://cima-clone.vercel.app/](https://cima-clone.vercel.app/)**

---

## 📦 Getting Started
```bash
# Clone the repo
git clone https://github.com/your‑username/CimaClone.git
cd CimaClone

# Install dependencies
npm install

# Run the development server
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🛠️ Build & Deploy
```bash
# Build for production
npm run build
```
The output is placed in the `dist/` directory and can be deployed to any static‑hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

---

## 🧪 Testing & Performance
- **Unit Tests** – `npm run test`
- **Lighthouse CI** – `npx lhci autorun` (or `npm run lhci`).
- **Performance Checklist** – see `.agents/rules/performance_test.md` for a detailed verification workflow.

---

## 🤝 Contributing
Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/awesome-feature`).
3. Open a pull request with a clear description of changes.

Make sure linting passes (`npm run lint`) and all tests succeed before submitting.

---

## 📜 License
This project is licensed under the **MIT License**.
