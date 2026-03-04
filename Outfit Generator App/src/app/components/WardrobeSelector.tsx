import { useState } from 'react';
import { ClothingItem, ClothingCategory } from '../types/wardrobe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WardrobeSelectorProps {
  wardrobe: ClothingItem[];
  unavailableItems: string[];
  onUnavailableChange: (itemIds: string[]) => void;
  onSelectAnchor?: (item: ClothingItem | undefined) => void;
  mode: 'unavailable' | 'anchor';
}

const categories: { value: ClothingCategory; label: string }[] = [
  { value: 'tops', label: 'Tops' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'outerwear', label: 'Outerwear' },
  { value: 'accessories', label: 'Accessories' },
];

export function WardrobeSelector({ 
  wardrobe, 
  unavailableItems, 
  onUnavailableChange,
  onSelectAnchor,
  mode 
}: WardrobeSelectorProps) {
  const [selectedAnchor, setSelectedAnchor] = useState<string | undefined>();

  const toggleUnavailable = (itemId: string) => {
    if (unavailableItems.includes(itemId)) {
      onUnavailableChange(unavailableItems.filter(id => id !== itemId));
    } else {
      onUnavailableChange([...unavailableItems, itemId]);
    }
  };

  const selectAnchor = (itemId: string) => {
    if (selectedAnchor === itemId) {
      setSelectedAnchor(undefined);
      onSelectAnchor?.(undefined);
    } else {
      setSelectedAnchor(itemId);
      const item = wardrobe.find(i => i.id === itemId);
      onSelectAnchor?.(item);
    }
  };

  const groupedWardrobe = categories.reduce((acc, cat) => {
    acc[cat.value] = wardrobe.filter(item => item.category === cat.value);
    return acc;
  }, {} as Record<ClothingCategory, ClothingItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === 'unavailable' ? 'Select Unavailable Items' : 'Choose Item to Style'}
        </CardTitle>
        <CardDescription>
          {mode === 'unavailable' 
            ? 'Mark items that are not available (in laundry, at dry cleaner, etc.)'
            : 'Select one item to build outfits around'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map(cat => {
          const items = groupedWardrobe[cat.value];
          if (items.length === 0) return null;
          
          return (
            <div key={cat.value}>
              <h3 className="text-sm font-medium mb-3">{cat.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => {
                  const isUnavailable = unavailableItems.includes(item.id);
                  const isAnchor = selectedAnchor === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        mode === 'anchor' && isAnchor
                          ? 'border-purple-600 bg-purple-50'
                          : isUnavailable
                          ? 'border-gray-300 bg-gray-50 opacity-60'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => mode === 'unavailable' ? toggleUnavailable(item.id) : selectAnchor(item.id)}
                    >
                      {mode === 'unavailable' && (
                        <Checkbox
                          checked={isUnavailable}
                          onCheckedChange={() => toggleUnavailable(item.id)}
                        />
                      )}
                      {mode === 'anchor' && (
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                          isAnchor ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                        }`}>
                          {isAnchor && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                        </div>
                      )}
                      {item.imageUrl && (
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <ImageWithFallback
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.colors.map(color => (
                            <Badge key={color} variant="secondary" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
