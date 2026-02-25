import { useState } from 'react';
import { Calendar, Cloud } from 'lucide-react';
import { DailyPlan, EventType, Weather } from '../types/wardrobe';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface PlanInputProps {
  onGenerateOutfit: (plan: DailyPlan) => void;
}

const eventTypes: { value: EventType; label: string; description: string }[] = [
  { value: 'work', label: 'Work', description: 'Professional office attire' },
  { value: 'casual', label: 'Casual', description: 'Relaxed everyday wear' },
  { value: 'formal', label: 'Formal', description: 'Elegant evening or special event' },
  { value: 'workout', label: 'Workout', description: 'Athletic and comfortable' },
  { value: 'date', label: 'Date Night', description: 'Stylish and attractive' },
  { value: 'outdoor', label: 'Outdoor', description: 'Practical and weather-appropriate' },
];

const weatherOptions: { value: Weather; label: string; icon: string }[] = [
  { value: 'hot', label: 'Hot (80°F+)', icon: '☀️' },
  { value: 'warm', label: 'Warm (65-80°F)', icon: '🌤️' },
  { value: 'cool', label: 'Cool (50-65°F)', icon: '🌥️' },
  { value: 'cold', label: 'Cold (Below 50°F)', icon: '❄️' },
];

export function PlanInput({ onGenerateOutfit }: PlanInputProps) {
  const [event, setEvent] = useState<EventType>('casual');
  const [weather, setWeather] = useState<Weather>('warm');
  const [notes, setNotes] = useState('');

  const handleGenerate = () => {
    onGenerateOutfit({
      event,
      weather,
      notes: notes || undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Plan Your Day
        </CardTitle>
        <CardDescription>
          Tell us about your plans and we'll suggest the perfect outfit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event">What's the occasion?</Label>
          <Select value={event} onValueChange={(value) => setEvent(value as EventType)}>
            <SelectTrigger id="event">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weather" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Weather
          </Label>
          <Select value={weather} onValueChange={(value) => setWeather(value as Weather)}>
            <SelectTrigger id="weather">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weatherOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any specific requirements or preferences..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={handleGenerate} className="w-full" size="lg">
          Generate Outfit Suggestions
        </Button>
      </CardContent>
    </Card>
  );
}
