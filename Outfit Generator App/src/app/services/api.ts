const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://f-it.onrender.com';

// Helper function to map backend Item to frontend ClothingItem
function mapBackendItemToClothingItem(backendItem: any): any {
  // Map backend Type to frontend category
  const typeToCategory: Record<string, string> = {
    'shirt': 'tops',
    'pants': 'bottoms',
    'shoe': 'shoes',
    'outerwear': 'outerwear',
    'accessory': 'accessories',
  };

  return {
    id: backendItem.IID?.toString() || backendItem.id?.toString() || '',
    name: backendItem.Name || backendItem.name || 'Unnamed Item',
    category: typeToCategory[backendItem.Type] || 'tops',
    colors: backendItem.Colors ? backendItem.Colors.split(',').map((c: string) => c.trim().toLowerCase()) : [],
    style: backendItem.Styles ? backendItem.Styles.split(',').map((s: string) => s.trim().toLowerCase()) : [],
    imageUrl: backendItem.Image_url || backendItem.imageUrl || undefined,
  };
}

export const api = {
  // Auth endpoints
  auth: {
    googleLogin: () => {
      const frontendUrl = window.location.origin;
      const callbackUrl = `${frontendUrl}/auth/callback`;
      window.location.href = `${API_BASE_URL}/auth/google?redirect=${encodeURIComponent(callbackUrl)}`;
    },

    getMe: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      return response.json();
    },
    
    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'GET',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },

  // User endpoints
  user: {
    updatePreferences: async (userID: string, preferences: {
      favorite_colors?: string[];
      favorite_styles?: string[];
    }) => {
      const response = await fetch(`${API_BASE_URL}/user/${userID}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(preferences),
      });
      return response.json();
    },

    getWardrobeByType: async (userID: string, type: string) => {
      const response = await fetch(`${API_BASE_URL}/user/${userID}/${type}`, {
        method: 'GET',
        credentials: 'include',
      });
      return response.json();
    },

    // Fetch all wardrobe items for a user
    getAllWardrobe: async (userID: string) => {
      try {
        // Fetch all clothing types in parallel
        const [shirtsRes, pantsRes, shoesRes, outerwearRes, accessoriesRes] = await Promise.all([
          api.user.getWardrobeByType(userID, 'shirt'),
          api.user.getWardrobeByType(userID, 'pants'),
          api.user.getWardrobeByType(userID, 'shoe'),
          api.user.getWardrobeByType(userID, 'outerwear'),
          api.user.getWardrobeByType(userID, 'accessory'),
        ]);

        // Backend returns items in a 'shirts' property for all types
        const backendItems = [
          ...(shirtsRes.shirts || []),
          ...(pantsRes.shirts || []),
          ...(shoesRes.shirts || []),
          ...(outerwearRes.shirts || []),
          ...(accessoriesRes.shirts || []),
        ];

        // Map backend items to frontend ClothingItem format
        return backendItems.map(mapBackendItemToClothingItem);
      } catch (error) {
        console.error('Error fetching wardrobe:', error);
        return [];
      }
    },

    // Add item to wardrobe
    addItem: async (userID: string, item: any) => {
      const response = await fetch(`${API_BASE_URL}/user/${userID}/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(item),
      });
      return response.json();
    },

    // Delete item from wardrobe
    deleteItem: async (userID: string, itemID: string) => {
      const response = await fetch(`${API_BASE_URL}/user/${userID}/item/${itemID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return response.json();
    },
  },

  // Location & Weather
  location: {
    getLocation: async () => {
      const response = await fetch(`${API_BASE_URL}/location`, {
        method: 'GET',
        credentials: 'include',
      });
      return response.json();
    },
  },

  // Outfit generation
  outfit: {
    generate: async (userID: string, style: string) => {
      const response = await fetch(`${API_BASE_URL}/generateOutfit/${userID}/${style}`, {
        method: 'GET',
        credentials: 'include',
      });
      return response.json();
    },
  },
};

export default api;
