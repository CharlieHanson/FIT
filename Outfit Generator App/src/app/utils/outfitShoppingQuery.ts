import { Outfit, DailyPlan } from '../types/wardrobe';

// TODO: read gender/style from user profile in Supabase
const GENDER_PREFIX = "men's";

export function buildComplementQuery(outfit: Outfit, plan: DailyPlan): string {
  const colors = outfit.top?.colors[0] || 'neutral';
  const eventLabel = plan.event === 'work' ? 'office' : plan.event;

  if (!outfit.outerwear && (plan.weather === 'cool' || plan.weather === 'cold')) {
    return `${GENDER_PREFIX} ${eventLabel} ${colors} jacket`;
  }
  if (outfit.accessories.length === 0) {
    return `${GENDER_PREFIX} ${eventLabel} ${colors} accessories`;
  }
  return `${GENDER_PREFIX} ${eventLabel} ${colors} fashion`;
}