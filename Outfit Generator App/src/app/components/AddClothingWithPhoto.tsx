import { useState } from 'react';
import { Camera, Upload, Loader2, Sparkles } from 'lucide-react';
import { ClothingItem, ClothingCategory, EventType, Color } from '../types/wardrobe';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { api } from '../services/api';

interface AddClothingWithPhotoProps {
  onAddItem: (item: Omit<ClothingItem, 'id'>) => void;
}

const categories: { value: ClothingCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
];

const eventTypes: { value: EventType; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'workout', label: 'Workout' },
  { value: 'date', label: 'Date Night' },
  { value: 'outdoor', label: 'Outdoor' },
];

const colors: { value: Color; label: string }[] = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'gray', label: 'Gray' },
  { value: 'navy', label: 'Navy' },
  { value: 'brown', label: 'Brown' },
  { value: 'beige', label: 'Beige' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'pink', label: 'Pink' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'other', label: 'Other' },
];

export function AddClothingWithPhoto({ onAddItem }: AddClothingWithPhotoProps) {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsAnalyzing(true);

    try {
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setPhoto(base64Image);

        // Get userID from localStorage
        const userID = localStorage.getItem('userID');
        
        // If demo user, skip AI analysis and just use the image
        if (userID === 'demo-user-123') {
          setIsAnalyzing(false);
          // For demo, just add with default values
          onAddItem({
            name: 'New Item',
            category: 'tops',
            colors: ['other'],
            style: ['casual'],
            imageUrl: base64Image,
          });
          setPhoto(null);
          setOpen(false);
          return;
        }

        if (!userID) {
          setError('User not authenticated');
          setIsAnalyzing(false);
          return;
        }

        // Call AI analysis endpoint
        const response = await api.user.analyzeImage(userID, base64Image);

        if (response.success && response.analysis) {
          const analysis = response.analysis;
          
          // Map backend category to frontend category
          const categoryMap: Record<string, ClothingCategory> = {
            'tops': 'tops',
            'shirt': 'tops',
            'bottoms': 'bottoms',
            'pants': 'bottoms',
            'shoes': 'shoes',
            'shoe': 'shoes',
            'outerwear': 'outerwear',
            'accessories': 'accessories',
            'accessory': 'accessories',
          };

          // Add the item with AI analysis
          onAddItem({
            name: analysis.name || 'New Item',
            category: categoryMap[analysis.category] || 'tops',
            colors: analysis.colors.map((c: string) => c.toLowerCase() as Color),
            style: analysis.styles.map((s: string) => s.toLowerCase() as EventType),
            imageUrl: base64Image,
          });

          // Reset and close
          setPhoto(null);
          setOpen(false);
        } else {
          setError('Failed to analyze image. Please try again.');
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setIsAnalyzing(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Camera className="w-4 h-4 mr-2" />
          Add with Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Item Recognition
          </DialogTitle>
          <DialogDescription>
            Upload a photo and our AI will automatically identify and add your clothing item
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isAnalyzing ? (
            <label
              htmlFor="photo-upload"
              className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 text-purple-600 mb-3" />
                <p className="text-sm font-medium text-purple-900 mb-1">
                  Click to upload photo
                </p>
                <p className="text-xs text-purple-600">
                  AI will analyze and add it automatically
                </p>
              </div>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isAnalyzing}
              />
            </label>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-72 border-2 border-purple-300 rounded-lg bg-purple-50">
              {photo && (
                <div className="relative w-full h-48 mb-4">
                  <ImageWithFallback
                    src={photo}
                    alt="Analyzing..."
                    className="w-full h-full object-cover rounded-lg opacity-50"
                  />
                </div>
              )}
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
              <p className="text-sm font-medium text-purple-900">Analyzing image...</p>
              <p className="text-xs text-purple-600">This may take a few seconds</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  setError(null);
                  setPhoto(null);
                  setIsAnalyzing(false);
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            <p>✨ AI will automatically detect:</p>
            <p>• Item name & category</p>
            <p>• Colors & style</p>
            <p>• Suitable occasions</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
