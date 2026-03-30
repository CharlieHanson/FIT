import { Product } from '../types/product';
import { ClothingItem } from '../types/wardrobe';

export async function fetchProductSuggestion(query: string): Promise<Product | null> {
  try {
    const apiKey = (import.meta as any).env.VITE_RAPIDAPI_KEY as string;
    const res = await fetch(
      `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=us&language=en`,
      {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
        },
      }
    );
    const data = await res.json();
    const products = data.data?.products ?? [];
    return products[0] || null;
  } catch {
    return null;
  }
}

export async function fetchComplementProducts(item: ClothingItem, count: number = 4): Promise<Product[]> {
    const GENDER_PREFIX = "men's"; // TODO: read from user profile
  
    // Build a query for items that complement this one
    const complementColors: Record<string, string> = {
      black: 'white', white: 'black', gray: 'navy', navy: 'beige',
      brown: 'white', beige: 'navy', red: 'black', blue: 'brown',
      green: 'beige', yellow: 'gray', pink: 'navy', purple: 'gray',
      orange: 'navy', other: 'black',
    };
  
    const itemColor = item.colors[0] || 'neutral';
    const matchColor = complementColors[itemColor] || 'neutral';
    const style = item.style[0] === 'work' ? 'office' : item.style[0] || 'casual';
  
    // Pick a complementary category
    const complementCategory: Record<string, string> = {
      tops: 'pants', bottoms: 'shirt', shoes: 'pants',
      outerwear: 'shirt', accessories: 'clothing',
    };
    const searchCategory = complementCategory[item.category] || 'clothing';
  
    const query = `${GENDER_PREFIX} ${matchColor} ${style} ${searchCategory}`;
  
    try {
      const apiKey = (import.meta as any).env.VITE_RAPIDAPI_KEY as string;
      const res = await fetch(
        `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=us&language=en`,
        {
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
          },
        }
      );
      const data = await res.json();
      const products: Product[] = data.data?.products ?? [];
      return products.slice(0, count);
    } catch {
      return [];
    }
  }