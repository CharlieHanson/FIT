import { Outfit, DailyPlan, ClothingItem } from '../types/wardrobe';

const GENDER_PREFIX = "men's"; // TODO: read from user profile

const complementColors: Record<string, string> = {
  black: 'white', white: 'black', gray: 'navy', navy: 'beige',
  brown: 'white', beige: 'navy', red: 'black', blue: 'brown',
  green: 'beige', yellow: 'gray', pink: 'navy', purple: 'gray',
  orange: 'navy', other: 'black',
};

const complementCategory: Record<string, string> = {
  tops: 'pants', bottoms: 'shirt', shoes: 'pants',
  outerwear: 'shirt', accessories: 'clothing',
};

export function buildComplementQuery(outfit: Outfit, plan: DailyPlan, anchorItem?: ClothingItem): string {
  const style = plan.event === 'work' ? 'office' : plan.event;

  // If there's an anchor item, build the query around it specifically
  if (anchorItem) {
    const anchorColor = anchorItem.colors[0] || 'neutral';
    const matchColor = complementColors[anchorColor] || 'neutral';
    const searchCategory = complementCategory[anchorItem.category] || 'clothing';
    return `${GENDER_PREFIX} ${matchColor} ${style} ${searchCategory}`;
  }

  // Otherwise fall back to outfit-based logic
  const colors = outfit.top?.colors[0] || 'neutral';

  if (!outfit.outerwear && (plan.weather === 'cool' || plan.weather === 'cold')) {
    return `${GENDER_PREFIX} ${style} ${colors} jacket`;
  }
  if (outfit.accessories.length === 0) {
    return `${GENDER_PREFIX} ${style} ${colors} accessories`;
  }
  return `${GENDER_PREFIX} ${style} ${colors} fashion`;
}