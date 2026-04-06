import { Weather } from '../types/wardrobe';

const API_BASE_URL = 'https://f-it.onrender.com'; 

export async function fetchWeatherCategory(): Promise<Weather> {
  try {
    const res = await fetch(`${API_BASE_URL}/weather`, {
      credentials: 'include', // Include cookies for session
    });
    const data = await res.json();

    if (!data.success) return 'warm'; // fallback

    const avgTemp: number = data.avgTemp;

    if (avgTemp >= 85) return 'hot';
    if (avgTemp >= 65) return 'warm';
    if (avgTemp >= 45) return 'cool';
    return 'cold';
  } catch {
    return 'warm'; // fallback if endpoint is down
  }
}