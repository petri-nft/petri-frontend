import { Tree, User, Lesson } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@tree.shares',
  displayName: 'Forest Keeper',
  bio: 'Passionate about reforestation and sustainability',
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockTrees: Tree[] = [
  {
    id: 'tree-1',
    ownerId: 'user-1',
    ownerName: 'Forest Keeper',
    species: 'Coast Redwood',
    nickname: 'Big Red',
    location: { label: 'Northern California' },
    plantedAt: '2024-10-15T10:00:00Z',
    lastWateredAt: '2025-01-07T08:00:00Z',
    healthIndex: 92,
    ndvi: 0.85,
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        takenAt: '2024-10-15T10:00:00Z',
        note: 'First planting!',
      },
    ],
    careIndex: 45,
    stewardshipScore: 78,
    tokenId: 'TT-001',
    characteristics: {
      size: 'Sapling (2-3 ft)',
      light: 'Full sun',
      soilType: 'Loamy',
    },
  },
  {
    id: 'tree-2',
    ownerId: 'user-1',
    ownerName: 'Forest Keeper',
    species: 'Japanese Maple',
    nickname: 'Crimson Grace',
    location: { label: 'Portland, OR' },
    plantedAt: '2024-11-01T14:00:00Z',
    lastWateredAt: '2025-01-08T07:30:00Z',
    healthIndex: 88,
    ndvi: 0.79,
    photos: [
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800',
        takenAt: '2024-11-01T14:00:00Z',
      },
    ],
    careIndex: 38,
    stewardshipScore: 65,
    tokenId: 'TT-002',
    characteristics: {
      size: 'Young tree (4-5 ft)',
      light: 'Partial shade',
      soilType: 'Well-draining',
    },
  },
  {
    id: 'tree-3',
    ownerId: 'user-2',
    ownerName: 'Tree Enthusiast',
    species: 'White Oak',
    nickname: 'Mighty Oak',
    location: { label: 'Vermont' },
    plantedAt: '2024-09-20T09:00:00Z',
    lastWateredAt: '2025-01-05T10:00:00Z',
    healthIndex: 95,
    ndvi: 0.89,
    photos: [
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800',
        takenAt: '2024-09-20T09:00:00Z',
      },
    ],
    careIndex: 52,
    stewardshipScore: 89,
    tokenId: 'TT-003',
    listed: true,
    price: 150,
    characteristics: {
      size: 'Established (6-8 ft)',
      light: 'Full sun',
      soilType: 'Clay-loam',
    },
  },
];

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Watering Best Practices',
    speciesTag: 'Coast Redwood',
    summary: 'Learn how to properly water your redwood for optimal growth',
    steps: [
      'Water deeply once or twice per week',
      'Ensure soil drains well to prevent root rot',
      'Morning watering is best to prevent fungal growth',
      'Adjust frequency based on season and rainfall',
    ],
    quiz: {
      question: 'When is the best time to water your tree?',
      options: ['Early morning', 'Midday', 'Late evening', 'Anytime'],
      correctIndex: 0,
    },
  },
  {
    id: 'lesson-2',
    title: 'Mulching for Health',
    summary: 'Understand the benefits and proper technique of mulching',
    steps: [
      'Apply 2-4 inches of organic mulch around the base',
      'Keep mulch 6 inches away from the trunk',
      'Replenish mulch annually as it decomposes',
      'Use wood chips, bark, or compost',
    ],
    quiz: {
      question: 'How far should mulch be from the trunk?',
      options: ['Touching the trunk', '2 inches', '6 inches', '12 inches'],
      correctIndex: 2,
    },
  },
  {
    id: 'lesson-3',
    title: 'Pest Identification',
    speciesTag: 'Japanese Maple',
    summary: 'Recognize common pests and take action early',
    steps: [
      'Inspect leaves regularly for discoloration',
      'Check for aphids on new growth',
      'Look for scale insects on branches',
      'Use neem oil or insecticidal soap for treatment',
    ],
    quiz: {
      question: 'What is a safe organic treatment for aphids?',
      options: ['Bleach', 'Neem oil', 'Gasoline', 'Salt water'],
      correctIndex: 1,
    },
  },
];
