const API_BASE_URL = 'https://f-it.onrender.com';

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
