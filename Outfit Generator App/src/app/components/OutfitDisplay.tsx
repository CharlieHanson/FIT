import { Outfit } from '../types/wardrobe';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Shirt, BookOpen, Footprints, Wind, Watch, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OutfitDisplayProps {
  outfits: Outfit[];
  onSaveToCalendar?: (outfitIndex: number) => void;
}

const categoryIcons = {
  top: Shirt,
  bottom: BookOpen,
  shoes: Footprints,
  outerwear: Wind,
  accessories: Watch,
};

export function OutfitDisplay({ outfits, onSaveToCalendar }: OutfitDisplayProps) {
  if (outfits.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-gray-500 text-center mb-2">No outfits generated yet</p>
          <p className="text-sm text-gray-400 text-center">
            Make sure you have enough items in your wardrobe and select your plan above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your Outfit Suggestions</h2>
        <div className={`grid gap-6 ${
          outfits.length === 1 
            ? 'grid-cols-1' 
            : outfits.length === 2 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {outfits.map((outfit, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="text-lg">Outfit {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {outfit.top && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {outfit.top.imageUrl ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <ImageWithFallback
                        src={outfit.top.imageUrl}
                        alt={outfit.top.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Shirt className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Top</div>
                    <div className="text-sm text-gray-900">{outfit.top.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {outfit.top.colors.map(color => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {outfit.bottom && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {outfit.bottom.imageUrl ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <ImageWithFallback
                        src={outfit.bottom.imageUrl}
                        alt={outfit.bottom.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Bottom</div>
                    <div className="text-sm text-gray-900">{outfit.bottom.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {outfit.bottom.colors.map(color => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {outfit.shoes && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {outfit.shoes.imageUrl ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <ImageWithFallback
                        src={outfit.shoes.imageUrl}
                        alt={outfit.shoes.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Footprints className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Shoes</div>
                    <div className="text-sm text-gray-900">{outfit.shoes.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {outfit.shoes.colors.map(color => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {outfit.outerwear && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {outfit.outerwear.imageUrl ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <ImageWithFallback
                        src={outfit.outerwear.imageUrl}
                        alt={outfit.outerwear.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Wind className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Outerwear</div>
                    <div className="text-sm text-gray-900">{outfit.outerwear.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {outfit.outerwear.colors.map(color => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {outfit.accessories.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {outfit.accessories[0]?.imageUrl ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                      <ImageWithFallback
                        src={outfit.accessories[0].imageUrl}
                        alt={outfit.accessories[0].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <Watch className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">Accessories</div>
                    {outfit.accessories.map((accessory, i) => (
                      <div key={i} className="text-sm text-gray-900">
                        {accessory.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onSaveToCalendar && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onSaveToCalendar(index)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Save to Calendar
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}