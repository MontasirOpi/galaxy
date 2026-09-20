# 🌌 Cosmic Odyssey: The Milky Way Galaxy | আকাশগঙ্গা ছায়াপথ

> An interactive 3D WebGL astronomy portal featuring a 3-tier deep cosmic zoom: Galaxy ➔ Solar System ➔ Planets & Moons, plus a photorealistic Sagittarius A* Black Hole simulator with General Relativity visualization in both **English** and **Bengali (বাংলা)**.

---

## 🌟 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Step-by-Step: Deploy to GitHub](#-step-by-step-deploy-to-github)
- [Step-by-Step: Connect & Deploy to Vercel](#-step-by-step-connect--deploy-to-vercel)
- [License](#-license)

---

## 🚀 Overview

**Cosmic Odyssey** is a client-side 3D WebGL experience built on Three.js. It allows users to seamlessly navigate the Milky Way Galaxy, dive deep into the Solar System, inspect orbital mechanics and surface features of individual celestial bodies, and simulate gravitational lensing around the supermassive black hole Sagittarius A*.

---

## ✨ Key Features

- **3-Tier Deep Zoom Navigation**:
  1. **Tier 1 (Galaxy Level)**: Macro-view of the Milky Way spiral arms, stellar clusters, and galactic core.
  2. **Tier 2 (Solar System Level)**: Heliocentric orbital simulation of planets with real-time orbital controls.
  3. **Tier 3 (Planetary & Lunar Level)**: High-resolution close-up exploration of planets, rings, and major moons.
- **Sagittarius A\* Black Hole Simulator**:
  - Photorealistic accretion disk visualization.
  - Relativistic beaming and gravitational lensing effects.
  - Interactive parameters (mass, spin, event horizon radius).
- **🌐 Bilingual Localization**:
  - Instant toggle between **English** and **Bengali (বাংলা)** with specialized astronomical terminology in both languages.
- **🎵 Cosmic Ambient Audio**:
  - Procedural Web Audio API sound generator creating an ethereal deep-space ambient soundscape.
- **📱 Responsive Glassmorphic UI**:
  - Modern HUD with neon accents, collapsible data cards, and telemetry readouts optimized for desktop and mobile browsers.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Core** | HTML5, CSS3, Modern JavaScript (ES6+) |
| **3D & WebGL Engine** | [Three.js](https://threejs.org/) (r128), `OrbitControls` |
| **Typography** | Google Fonts (*Outfit*, *Space Grotesk*, *Inter*, *JetBrains Mono*, *Hind Siliguri*) |
| **Local Server** | Node.js (Built-in `http` module — zero external runtime dependencies) |
| **Hosting & CI/CD** | GitHub + Vercel |

---

## 📂 Project Structure

```text
website/
├── .gitignore          # Excludes OS artifacts, logs, node_modules, and .vercel
├── index.html          # Core WebGL application, 3D scenes, shaders, and UI
├── js/
│   ├── OrbitControls.js # Camera controls for interactive 3D navigation
│   └── three.min.js     # Three.js 3D rendering library
├── package.json        # Project metadata and run scripts
├── README.md           # Project documentation and deployment guide
└── server.js           # Lightweight local Node.js static HTTP server
```

---

## 💻 Local Development

### Option 1: Using the Node.js Server (Recommended)

1. Make sure [Node.js](https://nodejs.org/) is installed on your computer.
2. From the project root (`website`), run:
   ```bash
   npm start
   ```
   *Alternatively:*
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Option 2: Direct Browser / Live Server

Because the application is a static site with relative asset paths, you can also:
- Double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox, Brave, Safari).
- Or use VS Code's **Live Server** extension.

---

## 🐙 Step-by-Step: Deploy to GitHub

Your GitHub repository remote is:
```text
https://github.com/MontasirOpi/galaxy.git
```

### 1. Initialize Git Locally
Open your terminal (PowerShell or Bash) in the project directory (`F:\Agy\website`):

```bash
git init
```

### 2. Stage All Project Files
```bash
git add .
```

### 3. Commit the Changes
```bash
git commit -m "Initial commit: Cosmic Odyssey Galaxy Exploration Portal"
```

### 4. Set the Default Branch to `main`
```bash
git branch -M main
```

### 5. Link Your GitHub Remote Repository
```bash
git remote add origin https://github.com/MontasirOpi/galaxy.git
```

*(If `origin` already exists, you can update it with: `git remote set-url origin https://github.com/MontasirOpi/galaxy.git`)*

### 6. Push to GitHub
```bash
git push -u origin main
```

> [!NOTE]
> If your remote GitHub repository already contains files (such as an auto-generated `README` or `license`), run `git pull origin main --rebase` before running `git push -u origin main`.

---

## ⚡ Step-by-Step: Connect & Deploy to Vercel

Vercel provides blazing-fast global CDN hosting for static web projects with automatic HTTPS and continuous deployment.

### Method A: Connecting GitHub to Vercel (Automatic Deployments on Push)

1. **Sign in to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.

2. **Import Your GitHub Repository**:
   - Click the **"Add New..."** button at the top-right of your Vercel Dashboard and select **"Project"**.
   - Under **"Import Git Repository"**, locate `MontasirOpi/galaxy` and click **"Import"**.
   *(If the repository is not visible, click "Configure GitHub App" to grant Vercel access to your repositories).*

3. **Configure Project Settings**:
   - **Project Name**: `galaxy` (or your preferred name).
   - **Framework Preset**: Select **"Other"**.
   - **Root Directory**: Leave as `./` (Root).
   - **Build Command**: Leave empty / toggle off.
   - **Output Directory**: Leave empty / toggle off (Vercel automatically serves `index.html` from root).

4. **Deploy**:
   - Click the blue **"Deploy"** button.
   - Vercel will build and assign you a live production URL (e.g., `https://galaxy-xxx.vercel.app`).

5. **Continuous Deployment (Automatic Updates)**:
   - Any time you commit and push changes to GitHub (`git push origin main`), Vercel will automatically detect the push and deploy the updated site in seconds.

---

### Method B: Deploying via Vercel CLI

If you prefer using the command line:

1. **Install Vercel CLI globally**:
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   vercel
   ```
   Follow the interactive prompts:
   - *Set up and deploy?* **Y**
   - *Which scope?* Select your account
   - *Link to existing project?* **N**
   - *Project name?* `galaxy`
   - *Directory located?* `./`

4. **Deploy directly to Production**:
   ```bash
   vercel --prod
   ```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) - feel free to explore, learn, and expand the cosmos!
