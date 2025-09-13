// Van Gogh paintings for each theme
// Using local images from public directory

export const vanGoghPaintings = {
  'default': {
    name: 'The Mulberry Tree',
    description: 'Simple, elegant countryside scene with gentle colors',
    imageUrl: 'mulberry-tree.jpg',
    year: '1889',
  },
  'cozy-homebody': {
    name: 'The Bedroom',
    description: 'A peaceful, intimate interior perfect for quiet moments',
    imageUrl: 'the-bedroom.jpg',
    year: '1888',
  },
  'adventure-seeker': {
    name: 'The Starry Night',
    description: 'Swirling energy and cosmic adventure awaits',
    imageUrl: 'starry-nights.jpg',
    year: '1889',
  },
  'social-butterfly': {
    name: 'The Dance Hall in Arles',
    description: 'Vibrant social gathering full of life and connection',
    imageUrl: 'dance-hall.jpg',
    year: '1888',
  },
  'wellness-warrior': {
    name: 'Wheatfield with Cypresses',
    description: 'Natural harmony and peaceful countryside serenity',
    imageUrl: 'wheatfield-cypresses.jpg',
    year: '1889',
  },
  'creative-artist': {
    name: 'Sunflowers',
    description: 'Bright, creative energy bursting with artistic inspiration',
    imageUrl: 'sunflowers.jpg',
    year: '1888',
  },
} as const;

export type VanGoghPaintingKey = keyof typeof vanGoghPaintings;

export const getVanGoghPainting = (themeId: string) => {
  return vanGoghPaintings[themeId as VanGoghPaintingKey] || null;
};

// CSS utility for applying Van Gogh backgrounds
export const getVanGoghBackgroundStyle = (themeId: string | null) => {
  if (!themeId) {
    const defaultPainting = vanGoghPaintings['default'];
    return {
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.65)), url(/${defaultPainting.imageUrl})`,
      backgroundSize: 'auto',
      backgroundPosition: 'center top',
      backgroundRepeat: 'repeat',
    };
  }
  
  const painting = getVanGoghPainting(themeId);
  if (!painting) return {};
  
  return {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.35)), url(/${painting.imageUrl})`,
    backgroundSize: 'auto',
    backgroundPosition: 'center top',
    backgroundRepeat: 'repeat',
  };
};
