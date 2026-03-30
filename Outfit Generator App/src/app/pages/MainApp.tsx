import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, LogOut, Calendar as CalendarIcon } from 'lucide-react';
import { ClothingItem, DailyPlan, Outfit } from '../types/wardrobe';
import { WardrobeManager } from '../components/WardrobeManager';
import { OutfitGeneratorEnhanced } from '../components/OutfitGeneratorEnhanced';
import { WardrobeSelector } from '../components/WardrobeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { pics } from '../../pics';
import Shopping from './Shopping';

// Sample wardrobe data
const sampleWardrobe: ClothingItem[] = [
  {
    id: '1',
    name: 'White Oxford Shirt',
    category: 'tops',
    colors: ['white'],
    style: ['work', 'formal', 'date'],
    imageUrl: pics.whiteOxford,
  },
  {
    id: '2',
    name: 'Black T-Shirt',
    category: 'tops',
    colors: ['black'],
    style: ['casual', 'workout'],
    imageUrl: pics.blackTShirt,
  },
  {
    id: '3',
    name: 'Navy Blazer',
    category: 'outerwear',
    colors: ['navy'],
    style: ['work', 'formal', 'date'],
    imageUrl: pics.navyBlazer,
  },
  {
    id: '4',
    name: 'Blue Jeans',
    category: 'bottoms',
    colors: ['blue'],
    style: ['casual', 'date', 'outdoor'],
    imageUrl: pics.jeans,
  },
  {
    id: '5',
    name: 'Black Dress Pants',
    category: 'bottoms',
    colors: ['black'],
    style: ['work', 'formal'],
    imageUrl: pics.blackDressPants,
  },
  {
    id: '6',
    name: 'Brown Leather Shoes',
    category: 'shoes',
    colors: ['brown'],
    style: ['work', 'formal', 'casual', 'date'],
    imageUrl: pics.brownShoes,
  },
  {
    id: '7',
    name: 'White Sneakers',
    category: 'shoes',
    colors: ['white'],
    style: ['casual', 'workout', 'outdoor', 'date'],
    imageUrl: pics.whiteSneakers,
  },
  {
    id: '8',
    name: 'Silver Watch',
    category: 'accessories',
    colors: ['gray'],
    style: ['work', 'formal', 'casual', 'date'],
    imageUrl: pics.watch,
  },
  {
    id: '9',
    name: 'Gray Sweater',
    category: 'tops',
    colors: ['gray'],
    style: ['casual', 'work', 'outdoor', 'date'],
    imageUrl: pics.graySweater,
  },
  {
    id: '10',
    name: 'White Sweatpants',
    category: 'bottoms',
    colors: ['white'],
    style: ['casual', 'workout'],
    imageUrl: pics.whiteSweats,
  },
  {
    id: '12',
    name: 'Striped Long Sleeve Tee',
    category: 'tops',
    colors: ['white', 'navy'],
    style: ['casual', 'outdoor'],
    imageUrl: pics.stripedLong,
  },
  {
    id: '13',
    name: 'Adidas Ultraboost',
    category: 'shoes',
    colors: ['black', 'white'],
    style: ['casual', 'outdoor', 'workout'],
    imageUrl: pics.ultraboost,
  },
  {
    id: '14',
    name: '"I paused my game to be here" T-shirt',
    category: 'tops',
    colors: ['gray'],
    style: ['casual', 'workout'],
    imageUrl: pics.pausedMyGameShirt,
  },
  {
    id: '15',
    name: 'Beige Turtleneck',
    category: 'tops',
    colors: ['beige'],
    style: ['casual', 'date', 'work'],
    imageUrl: pics.beigeTurtle,
  },
  {
    id: '16',
    name: 'Khaki Chinos',
    category: 'bottoms',
    colors: ['beige'],
    style: ['casual', 'work', 'date'],
    imageUrl: pics.khakis,
  },
  {
    id: '18',
    name: 'Navy Shorts',
    category: 'bottoms',
    colors: ['navy'],
    style: ['casual', 'workout', 'outdoor'],
    imageUrl: pics.navyShorts,
  },
  {
    id: '19',
    name: 'Black Rain Coat',
    category: 'outerwear',
    colors: ['black'],
    style: ['outdoor'],
    imageUrl: pics.blackRaincoat,
  },
  {
    id: '20',
    name: 'Gray Wool Trousers',
    category: 'bottoms',
    colors: ['gray'],
    style: ['work', 'formal', 'date'],
    imageUrl: pics.grayWoolTrousers,
  },
  {
    id: '21',
    name: 'Denim Jacket',
    category: 'outerwear',
    colors: ['blue'],
    style: ['casual', 'outdoor'],
    imageUrl: pics.denimJacket,
  },
  {
    id: '22',
    name: 'Black Leather Jacket',
    category: 'outerwear',
    colors: ['black'],
    style: ['casual', 'date'],
    imageUrl: pics.leatherJacket,
  },
  {
    id: '23',
    name: 'Beige Trench Coat',
    category: 'outerwear',
    colors: ['beige'],
    style: ['work', 'formal'],
    imageUrl: pics.trenchCoat,
  },
  {
    id: '24',
    name: 'Gray Hoodie',
    category: 'outerwear',
    colors: ['gray'],
    style: ['casual', 'workout', 'outdoor'],
    imageUrl: pics.grayHoodie,
  },
  {
    id: '25',
    name: 'Black Running Shoes',
    category: 'shoes',
    colors: ['black'],
    style: ['workout', 'casual'],
    imageUrl: pics.blackRunning,
  },
  {
    id: '26',
    name: 'Navy Loafers',
    category: 'shoes',
    colors: ['navy'],
    style: ['work', 'casual'],
    imageUrl: pics.navyLoafers,
  },
  {
    id: '28',
    name: 'Tan Boots',
    category: 'shoes',
    colors: ['brown'],
    style: ['casual', 'outdoor'],
    imageUrl: pics.brownBoots,
  },
  {
    id: '29',
    name: 'Leather Belt',
    category: 'accessories',
    colors: ['brown'],
    style: ['work', 'casual', 'formal'],
    imageUrl: pics.belt,
  },
  {
    id: '30',
    name: 'Sunglasses',
    category: 'accessories',
    colors: ['black'],
    style: ['casual', 'outdoor', 'date'],
    imageUrl: pics.sunglasses,
  },
  {
    id: '32',
    name: 'Gold Necklace',
    category: 'accessories',
    colors: ['yellow'],
    style: ['date', 'formal', 'casual','date'],
    imageUrl: pics.necklace,
  },
  {
    id: '33',
    name: 'Black Backpack',
    category: 'accessories',
    colors: ['black'],
    style: ['casual', 'outdoor', 'workout'],
    imageUrl: pics.backpack,
  },
  {
    id: '34',
    name: 'Beige Tote Bag',
    category: 'accessories',
    colors: ['beige'],
    style: ['work', 'casual'],
    imageUrl: pics.toteBag,
  },
];

export function MainApp() {
  const navigate = useNavigate();
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [unavailableItems, setUnavailableItems] = useState<string[]>([]);
  const [anchorItem, setAnchorItem] = useState<ClothingItem | undefined>();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Get user email
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }

    // Load wardrobe from localStorage or use sample data
    const savedWardrobe = localStorage.getItem('wardrobe');
    if (savedWardrobe) {
      const parsed = JSON.parse(savedWardrobe);
      // If saved wardrobe has fewer items than sample, update to new sample
      if (parsed.length < sampleWardrobe.length) {
        setWardrobe(sampleWardrobe);
        localStorage.setItem('wardrobe', JSON.stringify(sampleWardrobe));
      } else {
        setWardrobe(parsed);
      }
    } else {
      setWardrobe(sampleWardrobe);
    }
  }, [navigate]);

  useEffect(() => {
    // Save wardrobe to localStorage whenever it changes
    if (wardrobe.length > 0) {
      localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    }
  }, [wardrobe]);

  const handleAddItem = (item: Omit<ClothingItem, 'id'>) => {
    const newItem: ClothingItem = {
      ...item,
      id: Date.now().toString(),
    };
    setWardrobe([...wardrobe, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setWardrobe(wardrobe.filter(item => item.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Outfit Generator
                </h1>
              </div>
              <p className="text-gray-600">
                Smart outfit suggestions based on your wardrobe and daily plans
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="quick" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-5">
            <TabsTrigger value="quick">Quick Outfit</TabsTrigger>
            <TabsTrigger value="plan">Plan Ahead</TabsTrigger>
            <TabsTrigger value="style">Style an Item</TabsTrigger>
            <TabsTrigger value="wardrobe">Wardrobe</TabsTrigger>
            <TabsTrigger value="shop">Shop</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Need an Outfit Right Now?</CardTitle>
                <CardDescription>
                  Mark items that aren't available and we'll generate outfits from what you have
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WardrobeSelector
                  wardrobe={wardrobe}
                  unavailableItems={unavailableItems}
                  onUnavailableChange={setUnavailableItems}
                  mode="unavailable"
                />
              </CardContent>
            </Card>
            <OutfitGeneratorEnhanced
              wardrobe={wardrobe}
              unavailableItems={unavailableItems}
              anchorItem={undefined}
            />
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan an Outfit for Later</CardTitle>
                <CardDescription>
                  Generate outfits and save them to your calendar
                </CardDescription>
              </CardHeader>
            </Card>
            <OutfitGeneratorEnhanced
              wardrobe={wardrobe}
              unavailableItems={[]}
              anchorItem={undefined}
            />
          </TabsContent>

          <TabsContent value="style" className="space-y-6">
            <WardrobeSelector
              wardrobe={wardrobe}
              unavailableItems={[]}
              onUnavailableChange={() => {}}
              onSelectAnchor={setAnchorItem}
              mode="anchor"
            />
            {anchorItem && (
              <OutfitGeneratorEnhanced
                wardrobe={wardrobe}
                unavailableItems={unavailableItems}
                anchorItem={anchorItem}
              />
            )}
          </TabsContent>

          <TabsContent value="wardrobe">
            <WardrobeManager
              wardrobe={wardrobe}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
            />
          </TabsContent>

          <TabsContent value="shop">
            <Shopping />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
