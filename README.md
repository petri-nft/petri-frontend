# 🌳 Petri Frontend

> Your tree, your pet, your legacy

A gamified tree stewardship platform that transforms environmental action into an engaging experience. Plant real trees, mint dynamic NFTs, and nurture your TreeToken through AI-guided care powered by satellite data.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)

---

## ✨ Features

- 🌱 **Plant & Track Trees** - Capture GPS coordinates and monitor tree health in real-time
- 🤖 **AI Companion (Groot)** - Chat with your tree's personality-driven AI mentor
- 📸 **Photo Submissions** - Document growth with weekly progress photos
- 📊 **Health Dashboard** - Track NDVI scores, care index, and stewardship metrics
- 🎓 **Education Mode** - Complete micro-lessons tailored to your tree species
- 🛒 **Marketplace** - Trade TreeTokens with other users
- 🏆 **Gamification** - Earn badges, unlock rarities, climb leaderboards

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Backend API running (see [backend repo](https://github.com/petri-nft/petri-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/Xeeshan85/petri-frontend.git
cd petri-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

Visit `http://localhost:5173` or `8080` to see the app running! 🎉

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks |
| **TypeScript** | Type-safe development |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Lightweight state management |
| **React Router** | Client-side routing |
| **shadcn/ui** | Beautiful component library |

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── TreeCard.tsx    # Tree display card
│   ├── HealthBadge.tsx # Health indicator
│   ├── LessonCard.tsx  # Education modules
│   └── CameraCapture.tsx
├── pages/              # Route pages
│   ├── Landing.tsx     # Home dashboard
│   ├── PlantTree.tsx   # Tree planting flow
│   ├── TreeDetail.tsx  # Individual tree view
│   ├── Chat.tsx        # AI chat interface
│   ├── Trade.tsx       # Marketplace
│   └── Profile.tsx     # User portfolio
├── store/              # Zustand state
│   └── useStore.ts     # Global state management
├── lib/
│   ├── api.ts          # API client
│   └── utils.ts        # Helper functions
└── types/              # TypeScript definitions
```

---

## 🗺️ Routes

### Public Routes
- `/login` - Sign in
- `/register` - Create account

### Protected Routes (Require Authentication)
- `/` - Landing dashboard with stats & quick actions
- `/plant` - Plant new tree with live camera
- `/trees` - Grid view of all your trees
- `/trees/:id` - Detailed tree view with metrics
- `/submit` - Submit weekly progress photos
- `/chat` - Chat with Groot AI
- `/trade` - Browse and trade TreeTokens
- `/profile` - User portfolio & gallery

---

## 🔧 Available Scripts

```bash
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript validation
```

---



## 🎯 Key Features Explained

### TreeToken NFTs
Each tree is a unique, living NFT whose rarity evolves based on:
- **Health Index** (0-100%): Real-time NDVI from satellite data
- **Care Index**: Your engagement level
- **Stewardship Score**: Education completion + verified actions

### Groot AI Companion
Groot analyzes your tree's data and delivers:
- Personalized care instructions
- Humorous health updates via voice
- Context-aware education modules
- Weather-based action recommendations

### Health Scoring
Trees earn badges as they improve:
- 🔴 **Critical** (0-20%): Immediate care needed
- 🟠 **Needs Care** (21-40%): Attention required
- 🟡 **Fair** (41-60%): Stable condition
- 🟢 **Good** (61-80%): Thriving well
- 💚 **Excellent** (81-100%): Peak health


## 🧪 Testing

Currently using mock data for rapid prototyping. To test flows:

1. **Sign Up/Login** - Use demo account or create new user
2. **Plant Tree** - Use device camera or upload photo
3. **Daily Care** - Water trees, complete lessons
4. **Marketplace** - List trees, simulate purchases
5. **Profile** - View stats and achievements

---


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Team ISTARI

**Built with 💚 by:**
- Muhammad Masab Hammad
- Asim Iqbal
- Muhammad Zeeshan Naveed
- Mahad Rehman Durrani

---

## 📞 Support

- **Documentation**: [Link to Wiki]
- **Issues**: [GitHub Issues](https://github.com/Xeeshan85/petri-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Xeeshan85/petri-frontend/discussions)

---

<p align="center">
  <strong>🌳 Plant a tree. Mint an NFT. Change the world. 🌍</strong>
</p>
