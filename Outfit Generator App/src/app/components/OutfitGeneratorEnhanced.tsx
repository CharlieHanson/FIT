import React, { useState } from 'react';
import { RefreshCw, Calendar as CalendarIcon, Sparkles, ExternalLink, ShoppingBag } from 'lucide-react';
import { ClothingItem, DailyPlan, Outfit } from '../types/wardrobe';
import { Product } from '../types/product';
import { OutfitDisplay } from './OutfitDisplay';
import { PlanInput } from './PlanInput';
import { generateMultipleOutfits } from '../utils/outfitGenerator';
import { buildComplementQuery } from '../utils/outfitShoppingQuery';
import { fetchProductSuggestion } from '../utils/productSearch';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { UserPreferences } from '../utils/personalizedSearch';

interface OutfitGeneratorEnhancedProps {
  wardrobe: ClothingItem[];
  unavailableItems: string[];
  anchorItem?: ClothingItem;
  userPrefs: UserPreferences;
}

export function OutfitGeneratorEnhanced({
  wardrobe,
  unavailableItems,
  anchorItem,
  userPrefs,
}: OutfitGeneratorEnhancedProps) {
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState<number>(0);
  const [occasionNote, setOccasionNote] = useState('');
  const [suggestedProduct, setSuggestedProduct] = useState<Product | null>(null);
  const [productLoading, setProductLoading] = useState(false);

  const handleGenerateOutfit = async (plan: DailyPlan) => {
    setCurrentPlan(plan);
    setSuggestedProduct(null);

    const availableWardrobe = wardrobe.filter(
      (item) => !unavailableItems.includes(item.id)
    );

    let outfits: Outfit[];
    if (anchorItem) {
      outfits = generateOutfitsWithAnchor(availableWardrobe, plan, anchorItem);
    } else {
      outfits = generateMultipleOutfits(availableWardrobe, plan, 1);
    }

    if (outfits.length === 0) {
      setShowAlert(true);
      setGeneratedOutfits([]);
      setTimeout(() => setShowAlert(false), 5000);
    } else {
      setGeneratedOutfits(outfits);
      setShowAlert(false);

      setProductLoading(true);
      const query = buildComplementQuery(outfits[0], plan, userPrefs, anchorItem);
      const product = await fetchProductSuggestion(query);
      setSuggestedProduct(product);
      setProductLoading(false);
    }
  };

  const generateOutfitsWithAnchor = (
    availableWardrobe: ClothingItem[],
    plan: DailyPlan,
    anchor: ClothingItem
  ): Outfit[] => {
    const outfits: Outfit[] = [];

    for (let i = 0; i < 1; i++) {
      const outfit = generateMultipleOutfits(availableWardrobe, plan, 1)[0];
      if (outfit) {
        if (anchor.category === 'tops') outfit.top = anchor;
        else if (anchor.category === 'bottoms') outfit.bottom = anchor;
        else if (anchor.category === 'shoes') outfit.shoes = anchor;
        else if (anchor.category === 'outerwear') outfit.outerwear = anchor;
        else if (anchor.category === 'accessories') {
          outfit.accessories = [anchor, ...outfit.accessories].slice(0, 2);
        }
        outfits.push(outfit);
      }
    }

    return outfits;
  };

  const handleRegenerate = () => {
    if (currentPlan) {
      handleGenerateOutfit(currentPlan);
    }
  };

  const handleSaveToCalendar = (outfitIndex: number) => {
    setSelectedOutfitIndex(outfitIndex);
    setShowCalendar(true);
  };

  const confirmSaveToCalendar = () => {
    if (selectedDate && generatedOutfits[selectedOutfitIndex]) {
      const outfit = generatedOutfits[selectedOutfitIndex];
      const savedOutfits = JSON.parse(localStorage.getItem('savedOutfits') || '[]');

      const newSavedOutfit = {
        id: Date.now().toString(),
        date: selectedDate.toISOString(),
        outfit: {
          topId: outfit.top?.id,
          bottomId: outfit.bottom?.id,
          shoesId: outfit.shoes?.id,
          outerwearId: outfit.outerwear?.id,
          accessoryIds: outfit.accessories.map((a) => a.id),
        },
        occasion: occasionNote || currentPlan?.event || 'Outfit',
      };

      savedOutfits.push(newSavedOutfit);
      localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));

      setShowCalendar(false);
      setSelectedDate(undefined);
      setOccasionNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlanInput onGenerateOutfit={handleGenerateOutfit} />

          {anchorItem && (
            <Alert className="mt-4 border-purple-200 bg-purple-50">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <AlertDescription>
                Building outfits around: <strong>{anchorItem.name}</strong>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="lg:col-span-2">
          {showAlert && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertDescription>
                Couldn't generate outfits with your current wardrobe. Try adding
                more items that match your selected occasion, or choose a
                different event type.
              </AlertDescription>
            </Alert>
          )}

          {generatedOutfits.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button onClick={handleRegenerate} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Outfits
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <OutfitDisplay
                outfits={generatedOutfits}
                onSaveToCalendar={handleSaveToCalendar}
              />
            </div>

            <div>
              {productLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500 pt-4">
                  <div className="w-4 h-4 rounded-full border-2 border-purple-200 border-t-purple-600 animate-spin" />
                  Finding a match…
                </div>
              )}

              {suggestedProduct && !productLoading && (
                <SuggestedProductCard product={suggestedProduct} />
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Outfit to Calendar</DialogTitle>
            <DialogDescription>Choose a date for this outfit</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion (Optional)</Label>
              <Input
                id="occasion"
                placeholder="e.g., Team meeting, Dinner date"
                value={occasionNote}
                onChange={(e) => setOccasionNote(e.target.value)}
              />
            </div>
            <Button
              onClick={confirmSaveToCalendar}
              disabled={!selectedDate}
              className="w-full"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Save to Calendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SuggestedProductCard({ product }: { product: Product }) {
  const image = product.product_photos?.[0] ?? product.product_photo ?? null;
  const retailer = product.offer?.store_name ?? product.product_source ?? '';
  const href = product.offer?.offer_page_url ?? product.product_page_url ?? '#';
  const price = product.offer?.price ?? product.typical_price_range?.[0] ?? '—';

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ShoppingBag className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-700">Complete the look</h3>
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="group block">
        <Card className="overflow-hidden transition-shadow hover:shadow-md">
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
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
    </div>
  );
}