
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";

interface AdminProfileFormProps {
  onProfileCreated: () => void;
}

export const AdminProfileForm = ({ onProfileCreated }: AdminProfileFormProps) => {
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [visibilityDurationMonths, setVisibilityDurationMonths] = useState("1");
  const [isPremium, setIsPremium] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          full_name: fullName,
          whatsapp_number: whatsappNumber,
          visibility_duration_months: parseInt(visibilityDurationMonths),
          is_premium: isPremium,
          is_active: true
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Upload images
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const fileName = `${profile.id}-${i}-${Date.now()}.${file.name.split('.').pop()}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(`admin/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('profile-images')
          .getPublicUrl(`admin/${fileName}`);

        imageUrls.push(data.publicUrl);
      }

      // Save image records
      const imageRecords = imageUrls.map((url, index) => ({
        profile_id: profile.id,
        image_url: url,
        image_order: index + 1
      }));

      const { error: imagesError } = await supabase
        .from('profile_images')
        .insert(imageRecords);

      if (imagesError) throw imagesError;

      toast({
        title: "Success",
        description: "Profile created successfully",
      });

      // Reset form
      setFullName("");
      setWhatsappNumber("");
      setVisibilityDurationMonths("1");
      setIsPremium(false);
      setImages([]);
      onProfileCreated();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
          Create New Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="0791735461"
              required
            />
          </div>

          <div>
            <Label htmlFor="visibility">Visibility Duration</Label>
            <Select value={visibilityDurationMonths} onValueChange={setVisibilityDurationMonths}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="2">2 Months</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
                <SelectItem value="12">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPremium" 
              checked={isPremium}
              onCheckedChange={setIsPremium}
            />
            <Label htmlFor="isPremium" className="text-sm font-medium">
              Premium Profile
            </Label>
          </div>

          <div>
            <Label>Profile Images (1-5 images)</Label>
            <div className="mt-2">
              {images.length < 5 && (
                <label className="border-2 border-dashed border-border rounded-lg p-4 block cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images ({images.length}/5)
                    </p>
                  </div>
                </label>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" disabled={uploading} className="w-full">
            {uploading ? 'Creating Profile...' : 'Create Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
