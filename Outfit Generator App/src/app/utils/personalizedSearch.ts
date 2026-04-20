export interface UserPreferences {
    gender: string;        // "men's" | "women's" | "unisex"
    favoriteStyles: string[];
    favoriteColors: string[];
  }
  
  export function buildPersonalizedQuery(
    category: string,
    prefs: UserPreferences,
    extraTerms?: string
  ): string {
    const gender = prefs.gender || "unisex";
    const style = prefs.favoriteStyles?.[0]?.toLowerCase() || "casual";
    const color = prefs.favoriteColors?.[0]?.toLowerCase() || "";
  
    return [gender, style, color, category, extraTerms]
      .filter(Boolean)
      .join(" ")
      .trim();
  }