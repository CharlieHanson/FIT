import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, LogOut, Calendar as CalendarIcon } from 'lucide-react';
import { ClothingItem, DailyPlan, Outfit } from '../types/wardrobe';
import { WardrobeManager } from '../components/WardrobeManager';
import { OutfitGeneratorEnhanced } from '../components/OutfitGeneratorEnhanced';
import { WardrobeSelector } from '../components/WardrobeSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

// Sample wardrobe data
const sampleWardrobe: ClothingItem[] = [
  {
    id: '1',
    name: 'White Oxford Shirt',
    category: 'tops',
    colors: ['white'],
    style: ['work', 'formal', 'casual'],
  },
  {
    id: '2',
    name: 'Black T-Shirt',
    category: 'tops',
    colors: ['black'],
    style: ['casual', 'workout'],
  },
  {
    id: '3',
    name: 'Navy Blazer',
    category: 'outerwear',
    colors: ['navy'],
    style: ['work', 'formal', 'date'],
  },
  {
    id: '4',
    name: 'Blue Jeans',
    category: 'bottoms',
    colors: ['blue'],
    style: ['casual', 'date', 'outdoor'],
  },
  {
    id: '5',
    name: 'Black Dress Pants',
    category: 'bottoms',
    colors: ['black'],
    style: ['work', 'formal'],
  },
  {
    id: '6',
    name: 'Brown Leather Shoes',
    category: 'shoes',
    colors: ['brown'],
    style: ['work', 'formal', 'casual'],
  },
  {
    id: '7',
    name: 'White Sneakers',
    category: 'shoes',
    colors: ['white'],
    style: ['casual', 'workout', 'outdoor'],
  },
  {
    id: '8',
    name: 'Silver Watch',
    category: 'accessories',
    colors: ['gray'],
    style: ['work', 'formal', 'casual', 'date'],
  },
  {
    id: '9',
    name: 'Gray Sweater',
    category: 'tops',
    colors: ['gray'],
    style: ['casual', 'work', 'outdoor'],
  },
  {
    id: '10',
    name: 'Navy Polo Shirt',
    category: 'tops',
    colors: ['navy'],
    style: ['casual', 'work'],
  },
  {
    id: '11',
    name: 'Pink Blouse',
    category: 'tops',
    colors: ['pink'],
    style: ['work', 'casual', 'date'],
  },
  {
    id: '12',
    name: 'Striped Long Sleeve Tee',
    category: 'tops',
    colors: ['white', 'navy'],
    style: ['casual', 'outdoor'],
  },
  {
    id: '13',
    name: 'Red Cardigan',
    category: 'tops',
    colors: ['red'],
    style: ['casual', 'work'],
  },
  {
    id: '14',
    name: 'Black Sports Bra',
    category: 'tops',
    colors: ['black'],
    style: ['workout'],
  },
  {
    id: '15',
    name: 'Beige Turtleneck',
    category: 'tops',
    colors: ['beige'],
    style: ['casual', 'date', 'work'],
  },
  {
    id: '16',
    name: 'Khaki Chinos',
    category: 'bottoms',
    colors: ['beige'],
    style: ['casual', 'work'],
  },
  {
    id: '17',
    name: 'Black Leggings',
    category: 'bottoms',
    colors: ['black'],
    style: ['workout', 'casual'],
  },
  {
    id: '18',
    name: 'Navy Shorts',
    category: 'bottoms',
    colors: ['navy'],
    style: ['casual', 'workout', 'outdoor'],
  },
  {
    id: '19',
    name: 'Gray Wool Trousers',
    category: 'bottoms',
    colors: ['gray'],
    style: ['work', 'formal'],
  },
  {
    id: '20',
    name: 'Black Pencil Skirt',
    category: 'bottoms',
    colors: ['black'],
    style: ['work', 'formal'],
  },
  {
    id: '21',
    name: 'Denim Jacket',
    category: 'outerwear',
    colors: ['blue'],
    style: ['casual', 'outdoor'],
  },
  {
    id: '22',
    name: 'Black Leather Jacket',
    category: 'outerwear',
    colors: ['black'],
    style: ['casual', 'date'],
  },
  {
    id: '23',
    name: 'Beige Trench Coat',
    category: 'outerwear',
    colors: ['beige'],
    style: ['work', 'formal', 'casual'],
  },
  {
    id: '24',
    name: 'Gray Hoodie',
    category: 'outerwear',
    colors: ['gray'],
    style: ['casual', 'workout', 'outdoor'],
  },
  {
    id: '25',
    name: 'Black Running Shoes',
    category: 'shoes',
    colors: ['black'],
    style: ['workout', 'casual'],
  },
  {
    id: '26',
    name: 'Navy Loafers',
    category: 'shoes',
    colors: ['navy'],
    style: ['work', 'casual'],
  },
  {
    id: '27',
    name: 'Black Heels',
    category: 'shoes',
    colors: ['black'],
    style: ['work', 'formal', 'date'],
  },
  {
    id: '28',
    name: 'Tan Boots',
    category: 'shoes',
    colors: ['brown'],
    style: ['casual', 'outdoor'],
  },
  {
    id: '29',
    name: 'Leather Belt',
    category: 'accessories',
    colors: ['brown'],
    style: ['work', 'casual', 'formal'],
  },
  {
    id: '30',
    name: 'Sunglasses',
    category: 'accessories',
    colors: ['black'],
    style: ['casual', 'outdoor', 'date'],
  },
  {
    id: '31',
    name: 'Patterned Scarf',
    category: 'accessories',
    colors: ['red', 'beige'],
    style: ['casual', 'outdoor', 'work'],
  },
  {
    id: '32',
    name: 'Gold Necklace',
    category: 'accessories',
    colors: ['yellow'],
    style: ['date', 'formal', 'casual'],
  },
  {
    id: '33',
    name: 'Black Backpack',
    category: 'accessories',
    colors: ['black'],
    style: ['casual', 'outdoor', 'workout'],
  },
  {
    id: '34',
    name: 'Beige Tote Bag',
    category: 'accessories',
    colors: ['beige'],
    style: ['work', 'casual'],
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
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4">
            <TabsTrigger value="quick">Quick Outfit</TabsTrigger>
            <TabsTrigger value="plan">Plan Ahead</TabsTrigger>
            <TabsTrigger value="style">Style an Item</TabsTrigger>
            <TabsTrigger value="wardrobe">Wardrobe</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
}
