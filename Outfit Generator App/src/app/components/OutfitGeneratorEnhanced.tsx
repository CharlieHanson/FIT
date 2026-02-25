import { useState } from 'react';
import { RefreshCw, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { ClothingItem, DailyPlan, Outfit } from '../types/wardrobe';
import { OutfitDisplay } from './OutfitDisplay';
import { PlanInput } from './PlanInput';
import { generateMultipleOutfits } from '../utils/outfitGenerator';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface OutfitGeneratorEnhancedProps {
  wardrobe: ClothingItem[];
  unavailableItems: string[];
  anchorItem?: ClothingItem;
}

export function OutfitGeneratorEnhanced({ 
  wardrobe, 
  unavailableItems,
  anchorItem 
}: OutfitGeneratorEnhancedProps) {
  const [generatedOutfits, setGeneratedOutfits] = useState<Outfit[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState<number>(0);
  const [occasionNote, setOccasionNote] = useState('');

  const handleGenerateOutfit = (plan: DailyPlan) => {
    setCurrentPlan(plan);
    
    // Filter out unavailable items
    const availableWardrobe = wardrobe.filter(
      item => !unavailableItems.includes(item.id)
    );

    // If there's an anchor item, create a modified wardrobe that prioritizes it
    let outfits: Outfit[];
    if (anchorItem) {
      outfits = generateOutfitsWithAnchor(availableWardrobe, plan, anchorItem);
    } else {
      outfits = generateMultipleOutfits(availableWardrobe, plan, 3);
    }
    
    if (outfits.length === 0) {
      setShowAlert(true);
      setGeneratedOutfits([]);
      setTimeout(() => setShowAlert(false), 5000);
    } else {
      setGeneratedOutfits(outfits);
      setShowAlert(false);
    }
  };

  const generateOutfitsWithAnchor = (
    wardrobe: ClothingItem[], 
    plan: DailyPlan, 
    anchor: ClothingItem
  ): Outfit[] => {
    const outfits: Outfit[] = [];
    
    // Generate outfits that include the anchor item
    for (let i = 0; i < 3; i++) {
      const outfit = generateMultipleOutfits(wardrobe, plan, 1)[0];
      if (outfit) {
        // Replace the relevant category with the anchor item
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
          accessoryIds: outfit.accessories.map(a => a.id),
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
                Couldn't generate outfits with your current wardrobe. Try adding more items that match your selected occasion, or choose a different event type.
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
          
          <OutfitDisplay outfits={generatedOutfits} onSaveToCalendar={handleSaveToCalendar} />
        </div>
      </div>

      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Outfit to Calendar</DialogTitle>
            <DialogDescription>
              Choose a date for this outfit
            </DialogDescription>
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
