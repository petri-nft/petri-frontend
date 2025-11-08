# Petri - TreeToken Platform MVP

**Tagline:** Plant a tree → mint a digital TreeToken → learn to care with AI → trace its health → trade/own fractional shares.

## 🌳 Overview

Petri is a full-stack React application that combines reforestation with blockchain-style tokenization and AI-guided education. Each planted tree becomes a dynamic TreeToken (NFT-like card) with real health metrics, care logs, and educational lessons from Sage, your friendly AI companion.

## ✨ Features

### Core Functionality
- **🌱 Plant Trees**: Use your camera to capture a tree, add species/location details, and mint a TreeToken
- **📊 Health Tracking**: Monitor tree health with visual indices (0-100%), NDVI trends, and care logs
- **💧 Care Actions**: Water trees, submit weekly photo updates, track care indices
- **🤖 Sage AI Companion**: Chat with Sage for care tips and complete micro-lessons (60-90s) with quizzes
- **🏪 Marketplace**: List trees for sale, browse listings, simulate trading (buy/sell)
- **👤 Profile**: Creator gallery showing all owned and listed trees with stats

### Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **UI Components**: shadcn/ui, Headless UI, Lucide icons
- **State Management**: Zustand
- **Routing**: React Router v6
- **Camera**: Browser getUserMedia API
- **Data**: Mock in-memory store (ready for backend integration)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd petri

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Demo Account
```
Email: demo@tree.shares
Password: demo123
```

This account includes 2 seeded trees with mock data for testing.

## 📱 Pages & Routes

### Public Routes
- `/login` - Sign in page
- `/register` - Create account

### Protected Routes (require authentication)
- `/` - Landing page with tree overview, stats, and quick actions
- `/plant` - Plant a new tree with live camera capture
- `/trees` - Grid view of all your trees with filters/sorting
- `/trees/:id` - Detailed tree view with health metrics, care log, and lessons
- `/submit` - Submit weekly progress photos with notes
- `/chat` - Chat with Sage AI companion, trigger education mode
- `/trade` - Marketplace to browse and trade TreeTokens
- `/profile` - User profile with tree gallery (owned/listed)

## 🎨 Design System

### Color Palette
- **Primary**: `#2E7D32` (Forest Green) - main brand color
- **Accent**: `#A5D6A7` (Mint) - secondary highlights
- **Background**: `#F7FBF7` (Off-white) - soft base
- **Earth**: `#6D4C41` (Brown) - badges/chips
- **Health Gradients**: Red → Yellow → Green (0-100% health)

### Visual Style
- Rounded corners (`rounded-2xl`)
- Soft shadows with green tint
- Airy spacing and nature-first aesthetic
- Smooth transitions and hover effects
- WCAG AA compliant contrast ratios

## 🗂️ Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── CameraCapture.tsx
│   ├── HealthBadge.tsx
│   ├── LessonCard.tsx
│   ├── TreeCard.tsx
│   └── ProtectedRoute.tsx
├── pages/            # Route pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── PlantTree.tsx
│   ├── Trees.tsx
│   ├── TreeDetail.tsx
│   ├── Submit.tsx
│   ├── Chat.tsx
│   ├── Trade.tsx
│   └── Profile.tsx
├── store/            # Zustand state management
│   └── useStore.ts
├── types/            # TypeScript interfaces
│   └── index.ts
├── lib/              # Utilities and mock data
│   ├── mockData.ts
│   └── utils/
│       ├── camera.ts
│       └── helpers.ts
└── App.tsx           # Main app with routing
```

## 🔧 Key Components

### TreeCard
Displays tree overview with photo, health badge, stats, and action buttons (water, chat, trade).

### HealthBadge
Color-coded health indicator (0-100%) with labels: Critical, Needs Care, Fair, Good, Excellent.

### LessonCard
Education module from Sage with steps, quiz, and completion rewards (+5 Stewardship Score).

### CameraCapture
Full-screen camera interface with capture/retake/confirm flow, includes client-side image compression.

## 📊 Data Models

### Tree
```typescript
{
  id: string;
  ownerId: string;
  species: string;
  nickname?: string;
  location?: { lat, lng, label };
  plantedAt: string; // ISO
  lastWateredAt?: string;
  healthIndex: number; // 0-100
  photos: TreePhoto[];
  careIndex: number;
  stewardshipScore: number;
  tokenId?: string;
  listed?: boolean;
  price?: number;
}
```

### Lesson
```typescript
{
  id: string;
  title: string;
  speciesTag?: string;
  summary: string;
  steps: string[];
  quiz?: { question, options, correctIndex };
}
```

## 🧪 Testing

Currently includes mock data and in-memory state. To test flows:

1. **Authentication**: Use demo account or create new user
2. **Plant Flow**: Use real device camera or upload image
3. **Care Actions**: Water trees, submit photos, complete lessons
4. **Trade**: List trees, browse marketplace, simulate purchases
5. **Profile**: View stats and tree galleries

## 🚧 Future Enhancements

- [ ] Backend integration (API routes with database)
- [ ] Real NDVI calculation from satellite data
- [ ] Blockchain integration for true NFT minting
- [ ] PWA with offline support
- [ ] Push notifications for watering reminders
- [ ] Social features (follow users, like trees)
- [ ] Advanced marketplace filters
- [ ] Dark/light forest themes
- [ ] Multi-language support

## 📄 License

This is a demo project. For production use, implement proper backend, authentication, and data persistence.

## 🌟 Demo Screenshots

*Core flows are fully functional with seeded demo data*

---

Built with 💚 for a greener future
