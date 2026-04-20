import { Outfit, DailyPlan, ClothingItem } from '../types/wardrobe';
import { buildPersonalizedQuery, UserPreferences } from '../utils/personalizedSearch';

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

export function buildComplementQuery(
  outfit: Outfit,
  plan: DailyPlan,
  prefs: UserPreferences,
  anchorItem?: ClothingItem
): string {
  const style = plan.event === 'work' ? 'office' : plan.event;

  if (anchorItem) {
    const anchorColor = anchorItem.colors[0] || 'neutral';
    const matchColor = complementColors[anchorColor] || 'neutral';
    const searchCategory = complementCategory[anchorItem.category] || 'clothing';
    return buildPersonalizedQuery(searchCategory, prefs, `${matchColor} ${style}`);
  }

  const colors = outfit.top?.colors[0] || 'neutral';

  if (!outfit.outerwear && (plan.weather === 'cool' || plan.weather === 'cold')) {
    return buildPersonalizedQuery('jacket', prefs, `${style} ${colors}`);
  }
  const fallbacks = ['jacket', 'sneakers shoes', 'pants jeans', 'shirt top'];
  const pick = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return buildPersonalizedQuery(pick, prefs, `${style} ${colors}`);
}