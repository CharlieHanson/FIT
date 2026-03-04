import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ClothingItem, ClothingCategory, EventType, Color } from '../types/wardrobe';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { AddClothingWithPhoto } from './AddClothingWithPhoto';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WardrobeManagerProps {
  wardrobe: ClothingItem[];
  onAddItem: (item: Omit<ClothingItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
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

export function WardrobeManager({ wardrobe, onAddItem, onRemoveItem }: WardrobeManagerProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<EventType[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedColors.length > 0 && selectedStyles.length > 0) {
      onAddItem({
        name,
        category,
        colors: selectedColors,
        style: selectedStyles,
      });
      setName('');
      setSelectedColors([]);
      setSelectedStyles([]);
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

  const groupedWardrobe = categories.reduce((acc, cat) => {
    acc[cat.value] = wardrobe.filter(item => item.category === cat.value);
    return acc;
  }, {} as Record<ClothingCategory, ClothingItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Wardrobe</h2>
          <p className="text-sm text-gray-600">Manage your clothing items</p>
        </div>
        <div className="flex gap-2">
          <AddClothingWithPhoto onAddItem={onAddItem} />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Manually
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Clothing Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your wardrobe
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="grid grid-cols-3 gap-2">
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
        </div>
      </div>

      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat.value}>
            <h3 className="text-lg font-medium mb-3">{cat.label}</h3>
            {groupedWardrobe[cat.value].length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <p className="text-sm text-gray-500">No {cat.label.toLowerCase()} added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedWardrobe[cat.value].map(item => (
                  <Card key={item.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        {item.imageUrl && (
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <CardDescription>
                            {item.colors.map(color => (
                              <Badge key={color} variant="secondary" className="mr-1 text-xs">
                                {color}
                              </Badge>
                            ))}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {item.style.map(style => (
                          <Badge key={style} variant="outline" className="text-xs">
                            {eventTypes.find(e => e.value === style)?.label}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}