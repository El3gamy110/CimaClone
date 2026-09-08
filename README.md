# CimaClone 🎬

![CimaClone](https://cima-clone.vercel.app/favicon.png) <!-- Update this path if needed -->

**Live Demo:** [https://cima-clone.vercel.app/](https://cima-clone.vercel.app/)

CimaClone is a premium, beautifully designed movie and TV series discovery application. Built with modern web technologies, it features a sleek glassmorphism aesthetic, an interactive 3D background, and blazing-fast performance. Users can explore trending content, view detailed information about movies and shows, and manage their personal watchlist.

## ✨ Key Features

-   **Stunning UI/UX:** A rich, dark-mode design with glassmorphism effects, smooth gradients, and micro-animations.
-   **Dynamic 3D Background:** An immersive 3D scene that enhances the visual experience without compromising performance.
-   **Comprehensive Discovery:** Browse trending cinematic releases and top TV series.
-   **Detailed Media Profiles:** In-depth information for movies and TV shows, including cast, genres, ratings, and related media.
-   **Personalized Watchlist:** Users can create an account and curate their own watchlist, securely stored and synced across devices.
-   **Responsive Design:** A seamless experience across desktop, tablet, and mobile devices, featuring a custom mobile bottom navigation.
-   **Highly Optimized:** Built for speed with route-level code splitting, lazy-loaded images and 3D assets, and minimized bundle sizes.

## 🛠️ Technology Stack

-   **Frontend Framework:** React 18 with TypeScript
-   **Build Tool:** Vite
-   **Routing:** React Router v6
-   **State Management:** Zustand
-   **Styling:** Tailwind CSS (with custom vanilla CSS for specific effects)
-   **Backend & Authentication:** Supabase
-   **3D Graphics:** Three.js / React Three Fiber
-   **Animations:** GSAP (GreenSock Animation Platform)
-   **Icons:** Lucide React
-   **Data Source:** TMDB (The Movie Database) API

## 🚀 Performance Highlights

-   **Code Splitting:** Implemented `React.lazy` and `Suspense` for all routes and heavy components (like the 3D scene) to ensure rapid initial page loads.
-   **Asset Optimization:** Uses highly optimized image sizes (e.g., `w1280` for hero backdrops) and native lazy loading (`loading="lazy"`) for all offscreen media.
-   **Lean Bundle:** Removed unnecessary heavy dependencies (e.g., replaced large charting libraries with pure CSS alternatives) to keep the JavaScript bundle under 500KB gzipped.
-   **Accessibility:** Fully accessible with ARIA labels and keyboard navigation support.

## 💻 Running Locally

To run this project on your local machine, follow these steps:

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn
-   A Supabase project (for authentication and database)
-   A TMDB API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/El3gamy110/CimaClone.git
    cd CimaClone
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add the necessary environment variables. You will need:
    -   Supabase URL
    -   Supabase Anon Key
    -   (Optional) TMDB API key if you plan to change the default one in `src/lib/api.ts`.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Build for production:**
    ```bash
    npm run build
    ```

## 📜 License

This project is open-source and available under the MIT License.
