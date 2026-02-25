import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Camera, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function UploadOutfits() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleComplete = () => {
    navigate('/app');
  };

  const handleSkip = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold">Upload Your Favorite Outfits</h1>
          </div>
          <p className="text-gray-600">
            Upload photos of outfits you love, and we'll learn your style preferences
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Outfit Photos</CardTitle>
            <CardDescription>
              Upload 3-5 photos of outfits you already own and love wearing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label
                htmlFor="outfit-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                </div>
                <input
                  id="outfit-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                />
              </label>

              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-purple-200">
                      <ImageWithFallback
                        src={img}
                        alt={`Outfit ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white p-3 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">How it works</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• We analyze the colors, styles, and patterns in your photos</li>
                  <li>• Our AI learns your personal style preferences</li>
                  <li>• We'll suggest outfits that match your aesthetic</li>
                  <li>• The more photos you upload, the better the recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleSkip} className="flex-1">
            Skip for Now
          </Button>
          <Button
            onClick={handleComplete}
            disabled={uploadedImages.length === 0}
            className="flex-1"
          >
            {uploadedImages.length > 0 ? 'Continue to App' : 'Upload at Least One Photo'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
