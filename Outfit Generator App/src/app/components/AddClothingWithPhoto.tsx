import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { ClothingItem, ClothingCategory, EventType, Color } from '../types/wardrobe';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';

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
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<EventType[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhoto(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedColors.length > 0 && selectedStyles.length > 0) {
      onAddItem({
        name,
        category,
        colors: selectedColors,
        style: selectedStyles,
        imageUrl: photo || undefined,
      });
      setName('');
      setSelectedColors([]);
      setSelectedStyles([]);
      setPhoto(null);
      setOpen(false);
    }
  };

  const toggleColor = (color: Color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleStyle = (style: EventType) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Camera className="w-4 h-4 mr-2" />
          Add with Photo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Clothing Item</DialogTitle>
          <DialogDescription>
            Take or upload a photo of your clothing item
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Photo</Label>
            {!photo ? (
              <label
                htmlFor="photo-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload photo</p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            ) : (
              <div className="relative">
                <ImageWithFallback
                  src={photo}
                  alt="Clothing item"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setPhoto(null)}
                >
                  Change Photo
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="e.g., Blue Oxford Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ClothingCategory)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Colors</Label>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
              {colors.map(color => (
                <div key={color.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color.value}`}
                    checked={selectedColors.includes(color.value)}
                    onCheckedChange={() => toggleColor(color.value)}
                  />
                  <label
                    htmlFor={`color-${color.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {color.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Suitable For</Label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(event => (
                <div key={event.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`style-${event.value}`}
                    checked={selectedStyles.includes(event.value)}
                    onCheckedChange={() => toggleStyle(event.value)}
                  />
                  <label
                    htmlFor={`style-${event.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {event.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add to Wardrobe
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
