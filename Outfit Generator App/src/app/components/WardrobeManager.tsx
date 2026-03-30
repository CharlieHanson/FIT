import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, ShoppingBag, Loader2 } from 'lucide-react';
import { ClothingItem, ClothingCategory, EventType, Color } from '../types/wardrobe';
import { Product } from '../types/product';
import { fetchComplementProducts } from '../utils/productSearch';
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

  // Shopping suggestions state
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [shopLoading, setShopLoading] = useState(false);

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

  const handleItemClick = async (item: ClothingItem) => {
    setSelectedItem(item);
    setShopDialogOpen(true);
    setShopProducts([]);
    setShopLoading(true);
    const products = await fetchComplementProducts(item, 4);
    setShopProducts(products);
    setShopLoading(false);
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
          <p className="text-sm text-gray-600">Manage your clothing items · Click any item to find pieces that pair with it</p>
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
                  <Card
                    key={item.id}
                    className="cursor-pointer transition-shadow hover:shadow-md hover:border-purple-200"
                    onClick={() => handleItemClick(item)}
                  >
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
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveItem(item.id);
                              }}
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

      {/* Shopping suggestions dialog */}
      <Dialog open={shopDialogOpen} onOpenChange={setShopDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              Pairs well with: {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              Shopping suggestions that complement this piece
            </DialogDescription>
          </DialogHeader>

          {selectedItem?.imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-14 h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                <ImageWithFallback
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-sm">{selectedItem.name}</p>
                <div className="flex gap-1 mt-1">
                  {selectedItem.colors.map(c => (
                    <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {shopLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
              <p className="text-sm text-gray-500">Finding pieces that go with this…</p>
            </div>
          )}

          {!shopLoading && shopProducts.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-400">No suggestions found. Try another item.</p>
            </div>
          )}

          {!shopLoading && shopProducts.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {shopProducts.map((product, i) => (
                <ShopSuggestionCard key={product.product_id ?? i} product={product} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShopSuggestionCard({ product }: { product: Product }) {
  const image = product.product_photos?.[0] ?? product.product_photo ?? null;
  const retailer = product.offer?.store_name ?? product.product_source ?? '';
  const href = product.offer?.offer_page_url ?? product.product_page_url ?? '#';
  const price = product.offer?.price ?? product.typical_price_range?.[0] ?? '—';

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.product_title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">👕</div>
          )}
          {retailer && (
            <Badge variant="secondary" className="absolute top-2 left-2 text-xs opacity-90">
              {retailer}
            </Badge>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-1 shadow">
              <ExternalLink className="w-3 h-3 text-gray-600" />
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <p className="text-xs text-gray-800 leading-snug line-clamp-2 mb-2">
            {product.product_title}
          </p>
          <p className="text-sm font-semibold text-purple-600">{price}</p>
        </CardContent>
      </Card>
    </a>
  );
}