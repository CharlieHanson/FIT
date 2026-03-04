import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Slider } from '../components/ui/slider';

const STYLE_OPTIONS = [
  'Classic', 'Modern', 'Casual', 'Streetwear', 'Minimalist', 
  'Bohemian', 'Preppy', 'Athletic', 'Edgy', 'Romantic'
];

const WORK_TYPES = [
  'Corporate Office', 'Business Casual', 'Creative/Casual', 
  'Remote/Work from Home', 'Retail/Customer Facing', 'Healthcare', 
  'Education', 'Freelance', 'Student', 'Other'
];

const COLOR_PREFERENCES = [
  { value: 'neutrals', label: 'Neutrals', description: 'Black, white, gray, beige' },
  { value: 'earth-tones', label: 'Earth Tones', description: 'Browns, greens, tans' },
  { value: 'jewel-tones', label: 'Jewel Tones', description: 'Rich blues, emeralds, purples' },
  { value: 'pastels', label: 'Pastels', description: 'Soft pinks, blues, lavenders' },
  { value: 'brights', label: 'Bright Colors', description: 'Bold reds, yellows, oranges' },
  { value: 'monochrome', label: 'Monochrome', description: 'All one color family' },
];

const FIT_PREFERENCES = [
  { value: 'fitted', label: 'Fitted', description: 'Tailored, form-fitting' },
  { value: 'relaxed', label: 'Relaxed', description: 'Comfortable, loose' },
  { value: 'oversized', label: 'Oversized', description: 'Intentionally large' },
  { value: 'mixed', label: 'Mixed', description: 'Varies by piece' },
];

const PATTERN_PREFERENCES = [
  'Solid colors only',
  'Subtle patterns (pinstripes, small dots)',
  'Bold patterns (florals, geometric)',
  'Mix of both',
];

const FASHION_INSPIRATIONS = [
  'Celebrities/Influencers',
  'Fashion magazines',
  'Pinterest/Instagram',
  'Friends/Family',
  'Movies/TV shows',
  'Street style',
  'I create my own style',
];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [workType, setWorkType] = useState('');
  const [location, setLocation] = useState('');
  const [colorPreferences, setColorPreferences] = useState<string[]>([]);
  const [fitPreference, setFitPreference] = useState('');
  const [patternPreference, setPatternPreference] = useState('');
  const [comfortVsStyle, setComfortVsStyle] = useState([50]); // 0-100 slider
  const [budgetLevel, setBudgetLevel] = useState('');
  const [fashionInspirations, setFashionInspirations] = useState<string[]>([]);

  const totalSteps = 9;
  const progress = (step / totalSteps) * 100;

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleColorPreference = (color: string) => {
    setColorPreferences(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleInspiration = (inspiration: string) => {
    setFashionInspirations(prev =>
      prev.includes(inspiration) ? prev.filter(i => i !== inspiration) : [...prev, inspiration]
    );
  };

  const handleComplete = () => {
    const userProfile = {
      email: localStorage.getItem('userEmail') || '',
      name,
      styles: selectedStyles,
      workType,
      location,
      colorPreferences,
      fitPreference,
      patternPreference,
      comfortVsStyle: comfortVsStyle[0],
      budgetLevel,
      fashionInspirations,
      onboardingComplete: true,
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    navigate('/upload-outfits');
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return selectedStyles.length > 0;
    if (step === 3) return colorPreferences.length > 0;
    if (step === 4) return fitPreference.length > 0;
    if (step === 5) return patternPreference.length > 0;
    if (step === 6) return true; // Slider always has a value
    if (step === 7) return budgetLevel.length > 0;
    if (step === 8) return fashionInspirations.length > 0;
    if (step === 9) return workType.length > 0 && location.trim().length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl text-center">Discover Your Style</CardTitle>
          <CardDescription className="text-center">
            Help us understand your fashion preferences
          </CardDescription>
          <Progress value={progress} className="mt-4" />
          <p className="text-xs text-center text-gray-500 mt-2">Step {step} of {totalSteps}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">What's your name?</h3>
                <p className="text-sm text-gray-600">We'll use this to personalize your experience</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">What styles resonate with you?</h3>
                <p className="text-sm text-gray-600">Select all that apply</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STYLE_OPTIONS.map(style => (
                  <div
                    key={style}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                    <label className="cursor-pointer flex-1 text-sm font-medium">
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">What colors do you love?</h3>
                <p className="text-sm text-gray-600">Select your favorite color palettes</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {COLOR_PREFERENCES.map(color => (
                  <div
                    key={color.value}
                    className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      colorPreferences.includes(color.value)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleColorPreference(color.value)}
                  >
                    <Checkbox
                      checked={colorPreferences.includes(color.value)}
                      onCheckedChange={() => toggleColorPreference(color.value)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{color.label}</div>
                      <div className="text-xs text-gray-500">{color.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">How do you like your clothes to fit?</h3>
                <p className="text-sm text-gray-600">Choose your preferred fit</p>
              </div>
              <RadioGroup value={fitPreference} onValueChange={setFitPreference}>
                <div className="space-y-3">
                  {FIT_PREFERENCES.map(fit => (
                    <div
                      key={fit.value}
                      className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        fitPreference === fit.value
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFitPreference(fit.value)}
                    >
                      <RadioGroupItem value={fit.value} id={fit.value} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={fit.value} className="cursor-pointer font-medium text-sm">
                          {fit.label}
                        </Label>
                        <p className="text-xs text-gray-500">{fit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">How do you feel about patterns?</h3>
                <p className="text-sm text-gray-600">Choose your pattern preference</p>
              </div>
              <RadioGroup value={patternPreference} onValueChange={setPatternPreference}>
                <div className="space-y-3">
                  {PATTERN_PREFERENCES.map(pattern => (
                    <div
                      key={pattern}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        patternPreference === pattern
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPatternPreference(pattern)}
                    >
                      <RadioGroupItem value={pattern} id={pattern} />
                      <Label htmlFor={pattern} className="cursor-pointer flex-1 text-sm font-medium">
                        {pattern}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Comfort vs. Style</h3>
                <p className="text-sm text-gray-600">Where do you fall on the spectrum?</p>
              </div>
              <div className="space-y-6 px-4">
                <Slider
                  value={comfortVsStyle}
                  onValueChange={setComfortVsStyle}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <div className="text-center">
                    <div className="font-medium">Comfort First</div>
                    <div className="text-xs text-gray-500">Prioritize ease</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Balanced</div>
                    <div className="text-xs text-gray-500">Mix of both</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Style First</div>
                    <div className="text-xs text-gray-500">Fashion focused</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="inline-block bg-purple-50 px-4 py-2 rounded-full">
                    <span className="font-semibold text-purple-600">
                      {comfortVsStyle[0] < 33 ? 'Comfort Focused' : 
                       comfortVsStyle[0] < 66 ? 'Balanced Approach' : 
                       'Style Focused'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">What's your typical clothing budget?</h3>
                <p className="text-sm text-gray-600">This helps us make realistic suggestions</p>
              </div>
              <RadioGroup value={budgetLevel} onValueChange={setBudgetLevel}>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      budgetLevel === 'budget'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBudgetLevel('budget')}
                  >
                    <RadioGroupItem value="budget" id="budget" />
                    <Label htmlFor="budget" className="cursor-pointer flex-1 text-sm font-medium">
                      Budget-Friendly (Fast fashion, sales, thrifting)
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      budgetLevel === 'moderate'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBudgetLevel('moderate')}
                  >
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate" className="cursor-pointer flex-1 text-sm font-medium">
                      Moderate (Mid-range brands, occasional splurges)
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      budgetLevel === 'premium'
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setBudgetLevel('premium')}
                  >
                    <RadioGroupItem value="premium" id="premium" />
                    <Label htmlFor="premium" className="cursor-pointer flex-1 text-sm font-medium">
                      Premium (Designer brands, quality investment pieces)
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Where do you get fashion inspiration?</h3>
                <p className="text-sm text-gray-600">Select all that apply</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {FASHION_INSPIRATIONS.map(inspiration => (
                  <div
                    key={inspiration}
                    className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      fashionInspirations.includes(inspiration)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleInspiration(inspiration)}
                  >
                    <Checkbox
                      checked={fashionInspirations.includes(inspiration)}
                      onCheckedChange={() => toggleInspiration(inspiration)}
                    />
                    <label className="cursor-pointer flex-1 text-sm font-medium">
                      {inspiration}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">A few final details</h3>
                <p className="text-sm text-gray-600">Help us tailor suggestions to your lifestyle</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="work">Work Environment</Label>
                  <Select value={workType} onValueChange={setWorkType}>
                    <SelectTrigger id="work" className="text-base">
                      <SelectValue placeholder="Select your work type" />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">City or Region</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, San Francisco, London"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500">We'll consider the climate for outfit suggestions</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed()}
                className="flex-1"
              >
                Complete Setup
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}