import React, { useState, useEffect } from 'react';
import { User, Mail, Palette, Sparkles, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

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

interface ProfileSettingsProps {
  userEmail?: string;
  userName?: string;
  userPhoto?: string;
  initialColors?: string[];
  initialStyles?: string[];
  initialGender?: string;
  onSave?: (data: { name: string; colors: string[]; styles: string[]; gender: string }) => void;
  onBack?: () => void;
}

export function ProfileSettings({
  userEmail = '',
  userName = '',
  userPhoto = '',
  initialColors = [],
  initialStyles = [],
  initialGender = '',
  onSave,
  onBack,
}: ProfileSettingsProps) {
  const [name, setName] = useState(userName);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialColors);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialStyles);
  const [gender, setGender] = useState<string>(initialGender);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setName(userName);
    setSelectedColors(initialColors);
    setSelectedStyles(initialStyles);
    setGender(initialGender);
  }, [userName, initialColors, initialStyles, initialGender]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave({ name, colors: selectedColors, styles: selectedStyles, gender });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wardrobe
        </Button>
      )}
      
      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            View and update your basic profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo */}
          {userPhoto && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={userPhoto}
                  alt={name || 'User'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                />
              </div>
            </div>
          )}

          {/* Email (Non-editable) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender Preference</Label>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="grid grid-cols-3 gap-3">
                {GENDER_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      gender === option.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGender(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                    <Label htmlFor={`gender-${option.value}`} className="cursor-pointer text-sm font-medium flex-1">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Colors Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Favorite Colors
          </CardTitle>
          <CardDescription>
            Select up to 5 colors you love to wear ({selectedColors.length}/5 selected)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Favorite Styles Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Favorite Styles
          </CardTitle>
          <CardDescription>
            Select up to 3 styles that best describe your fashion taste ({selectedStyles.length}/3 selected)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {STYLE_OPTIONS.map((style) => (
              <div
                key={style}
                className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
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
                <label className="cursor-pointer text-sm font-medium flex-1">
                  {style}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
          size="lg"
          className="min-w-[200px]"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
