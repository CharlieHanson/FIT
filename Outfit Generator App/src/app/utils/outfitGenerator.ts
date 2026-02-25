import { ClothingItem, DailyPlan, Outfit, EventType, Weather } from '../types/wardrobe';

// Color compatibility matrix
const colorMatches: Record<string, string[]> = {
  black: ['white', 'gray', 'red', 'blue', 'pink', 'beige', 'other'],
  white: ['black', 'navy', 'blue', 'gray', 'brown', 'red', 'green', 'pink', 'purple', 'other'],
  gray: ['white', 'black', 'navy', 'pink', 'yellow', 'blue', 'other'],
  navy: ['white', 'beige', 'gray', 'brown', 'pink', 'other'],
  brown: ['white', 'beige', 'cream', 'navy', 'green', 'orange', 'other'],
  beige: ['white', 'brown', 'navy', 'black', 'green', 'other'],
  red: ['black', 'white', 'navy', 'gray', 'beige', 'other'],
  blue: ['white', 'black', 'gray', 'beige', 'brown', 'other'],
  green: ['white', 'brown', 'beige', 'navy', 'black', 'other'],
  yellow: ['white', 'gray', 'navy', 'black', 'other'],
  pink: ['white', 'gray', 'navy', 'black', 'beige', 'other'],
  purple: ['white', 'gray', 'black', 'beige', 'other'],
  orange: ['white', 'brown', 'navy', 'black', 'other'],
  other: ['white', 'black', 'gray', 'navy', 'beige', 'other'],
};

function colorsMatch(colors1: string[], colors2: string[]): boolean {
  for (const color1 of colors1) {
    for (const color2 of colors2) {
      if (colorMatches[color1]?.includes(color2) || color1 === color2) {
        return true;
      }
    }
  }
  return false;
}

function itemMatchesEvent(item: ClothingItem, event: EventType): boolean {
  return item.style.includes(event);
}

function itemMatchesWeather(item: ClothingItem, weather: Weather): boolean {
  // Simple logic: outerwear for cool/cold, lighter items for hot/warm
  if (item.category === 'outerwear') {
    return weather === 'cool' || weather === 'cold';
  }
  return true; // Most items work in any weather
}

export function generateOutfit(wardrobe: ClothingItem[], plan: DailyPlan): Outfit | null {
  const { event, weather } = plan;

  // Filter items by category and suitability
  const tops = wardrobe.filter(
    item => item.category === 'tops' && itemMatchesEvent(item, event)
  );
  const bottoms = wardrobe.filter(
    item => item.category === 'bottoms' && itemMatchesEvent(item, event)
  );
  const shoes = wardrobe.filter(
    item => item.category === 'shoes' && itemMatchesEvent(item, event)
  );
  const outerwear = wardrobe.filter(
    item => item.category === 'outerwear' && itemMatchesEvent(item, event) && itemMatchesWeather(item, weather)
  );
  const accessories = wardrobe.filter(
    item => item.category === 'accessories' && itemMatchesEvent(item, event)
  );

  if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
    return null; // Not enough items to create an outfit
  }

  // Try to find matching combinations
  for (const top of tops) {
    for (const bottom of bottoms) {
      if (colorsMatch(top.colors, bottom.colors)) {
        for (const shoe of shoes) {
          if (colorsMatch(shoe.colors, bottom.colors) || colorsMatch(shoe.colors, top.colors)) {
            const outfit: Outfit = {
              top,
              bottom,
              shoes: shoe,
              accessories: accessories.slice(0, 2), // Add up to 2 accessories
            };

            // Add outerwear if weather is cool/cold
            if ((weather === 'cool' || weather === 'cold') && outerwear.length > 0) {
              outfit.outerwear = outerwear[0];
            }

            return outfit;
          }
        }
      }
    }
  }

  // If no perfect match, return a basic combination
  return {
    top: tops[0],
    bottom: bottoms[0],
    shoes: shoes[0],
    outerwear: outerwear.length > 0 ? outerwear[0] : undefined,
    accessories: accessories.slice(0, 1),
  };
}

export function generateMultipleOutfits(wardrobe: ClothingItem[], plan: DailyPlan, count: number = 3): Outfit[] {
  const outfits: Outfit[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count * 10 && outfits.length < count; i++) {
    const outfit = generateOutfit(wardrobe, plan);
    if (outfit) {
      const key = `${outfit.top?.id}-${outfit.bottom?.id}-${outfit.shoes?.id}`;
      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        outfits.push(outfit);
        
        // Shuffle wardrobe slightly for next iteration
        wardrobe = [...wardrobe].sort(() => Math.random() - 0.5);
      }
    }
  }

  return outfits;
}
