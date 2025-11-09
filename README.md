# Petri Frontend

React platform for tree NFTs with AI chat, health tracking, and marketplace.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
```

## Tech Stack

- React 18 + TypeScript
- Vite, Tailwind CSS
- Zustand (state management)
- React Router
- shadcn/ui components

## Features

- User authentication with JWT
- Plant and manage trees
- AI chat with personality responses
- Real-time health tracking
- Tree marketplace
- User profile and portfolio
- Camera integration for tree photos

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── TreeChat.tsx
│   ├── TreePersonalitySetup.tsx
│   └── ui/          # shadcn/ui
├── pages/           # Route pages
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── PlantTree.tsx
│   ├── Trees.tsx
│   ├── TreeDetail.tsx
│   └── Profile.tsx
├── lib/
│   ├── api.ts       # API client
│   └── utils.ts
├── store/           # Zustand state
└── types/
```

## Environment

```
VITE_API_URL=http://localhost:8000/api
```

## API Endpoints

- `/api/auth/*` - Authentication
- `/api/trees/*` - Tree management
- `/api/trees/{id}/chat` - AI chat
- `/api/trees/{id}/personality` - Personality setup
- `/api/trees/{id}/transcribe-voice` - Voice transcription

## Routes

- `/` - Home
- `/login` - Login
- `/register` - Register
- `/trees` - Tree list
- `/trees/:id` - Tree detail
- `/plant` - Plant tree
- `/profile` - User profile
- `/chat` - Chat interface

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
