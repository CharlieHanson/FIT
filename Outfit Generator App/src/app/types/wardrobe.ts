export type ClothingCategory = 'tops' | 'bottoms' | 'shoes' | 'outerwear' | 'accessories';
export type EventType = 'work' | 'casual' | 'formal' | 'workout' | 'date' | 'outdoor';
export type Weather = 'hot' | 'warm' | 'cool' | 'cold';
export type Color = 'black' | 'white' | 'gray' | 'navy' | 'brown' | 'beige' | 'red' | 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange' | 'other';
export type Style2 =
  | 'casual' | 'classic' | 'chic' | 'elegant' | 'retro'
  | 'artsy' | 'minimal' | 'professional' | 'grunge' | 'sporty'
  | 'streetwear' | 'preppy' | 'country' | 'workwear';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  colors: Color[];
  style: EventType[];
  styles2?: Style2[];
  minTemp?: number;
  maxTemp?: number;
  imageUrl?: string;
}

export interface DailyPlan {
  event: EventType;
  weather: Weather;
  notes?: string;
}

export interface Outfit {
  top?: ClothingItem;
  bottom?: ClothingItem;
  shoes?: ClothingItem;
  outerwear?: ClothingItem;
  accessories: ClothingItem[];
}
