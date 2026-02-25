export interface UserProfile {
  email: string;
  name?: string;
  styles: string[];
  workType: string;
  location: string;
  onboardingComplete: boolean;
}

export interface SavedOutfit {
  id: string;
  date: string;
  outfit: {
    topId?: string;
    bottomId?: string;
    shoesId?: string;
    outerwearId?: string;
    accessoryIds: string[];
  };
  occasion: string;
}
