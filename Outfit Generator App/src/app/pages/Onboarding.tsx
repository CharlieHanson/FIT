import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';

const COLOR_OPTIONS = {
  neutrals: [
    { value: 'Black', hex: '#000000' },
    { value: 'White', hex: '#FFFFFF' },
    { value: 'Grey', hex: '#808080' },
    { value: 'Beige', hex: '#F5F5DC' },
    { value: 'Brown', hex: '#8B4513' },
    { value: 'Cream', hex: '#FFFDD0' },
  ],
  warm: [
    { value: 'Red', hex: '#DC2626' },
    { value: 'Orange', hex: '#F97316' },
    { value: 'Yellow', hex: '#FBBF24' },
    { value: 'Burgundy', hex: '#800020' },
    { value: 'Olive', hex: '#808000' },
  ],
  cool: [
    { value: 'Navy', hex: '#000080' },
    { value: 'Blue', hex: '#3B82F6' },
    { value: 'Green', hex: '#10B981' },
    { value: 'Teal', hex: '#14B8A6' },
    { value: 'Purple', hex: '#A855F7' },
    { value: 'Pink', hex: '#EC4899' },
  ],
};

const STYLE_OPTIONS = [
  'Streetwear',
  'Casual',
  'Classic',
  'Minimalist',
  'Preppy',
  'Workwear',
  'Athletic',
  'Vintage',
  'Bohemian',
  'Elegant',
];

const GENDER_OPTIONS = [
  { value: "men's", label: "Men's" },
  { value: "women's", label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [gender, setGender] = useState<string>('');

  const toggleColor = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      }
      if (prev.length >= 5) {
        return prev; // Max 5 colors
      }
      return [...prev, color];
    });
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(style)) {
        return prev.filter(s => s !== style);
      }
      if (prev.length >= 3) {
        return prev; // Max 3 styles
      }
      return [...prev, style];
    });
  };

  const handleComplete = () => {
    const userProfile = {
      email: localStorage.getItem('userEmail') || '',
      colors: selectedColors,
      styles: selectedStyles,
      gender: gender,
      onboardingComplete: true,
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    navigate('/upload-outfits');
  };

  const canProceed = () => {
    return selectedColors.length > 0 && selectedStyles.length > 0 && gender.length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center">Set Up Your Style Profile</CardTitle>
          <CardDescription className="text-center">
            Tell us about your fashion preferences to get personalized outfit suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Gender Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Gender Preference</h3>
              <p className="text-sm text-gray-600 mb-4">Choose your preferred clothing style</p>
            </div>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="grid grid-cols-3 gap-3">
                {GENDER_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      gender === option.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGender(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer flex-1 text-sm font-medium">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Favorite Colors</h3>
              <p className="text-sm text-gray-600 mb-2">Select up to 5 colors you love to wear</p>
              <p className="text-xs text-purple-600 font-medium">{selectedColors.length}/5 selected</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Neutrals</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {COLOR_OPTIONS.neutrals.map((color) => (
                    <div
                      key={color.value}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedColors.includes(color.value)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleColor(color.value)}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
                        style={{
                          backgroundColor: color.hex,
                          boxShadow: color.value === 'White' ? 'inset 0 0 0 1px #e5e7eb' : 'none',
                        }}
                      />
                      <Checkbox
                        checked={selectedColors.includes(color.value)}
                        onCheckedChange={() => toggleColor(color.value)}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{color.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Warm Tones</h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {COLOR_OPTIONS.warm.map((color) => (
                    <div
                      key={color.value}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedColors.includes(color.value)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleColor(color.value)}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <Checkbox
                        checked={selectedColors.includes(color.value)}
                        onCheckedChange={() => toggleColor(color.value)}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{color.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Cool Tones</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {COLOR_OPTIONS.cool.map((color) => (
                    <div
                      key={color.value}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedColors.includes(color.value)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleColor(color.value)}
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <Checkbox
                        checked={selectedColors.includes(color.value)}
                        onCheckedChange={() => toggleColor(color.value)}
                        className="sr-only"
                      />
                      <span className="text-xs font-medium">{color.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Style Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Favorite Styles</h3>
              <p className="text-sm text-gray-600 mb-2">Select up to 3 styles that best describe your fashion taste</p>
              <p className="text-xs text-purple-600 font-medium">{selectedStyles.length}/3 selected</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {STYLE_OPTIONS.map((style) => (
                <div
                  key={style}
                  className={`flex items-center justify-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedStyles.includes(style)
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleStyle(style)}
                >
                  <Checkbox
                    checked={selectedStyles.includes(style)}
                    onCheckedChange={() => toggleStyle(style)}
                  />
                  <label className="cursor-pointer text-sm font-medium">
                    {style}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleComplete}
              disabled={!canProceed()}
              size="lg"
              className="min-w-[200px]"
            >
              Complete Setup
              <Check className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
