import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, ArrowLeft } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  is_active: boolean;
  visibility_duration_months: number;
  visibility_start_date: string;
  visibility_end_date: string;
  images: { id: string; image_url: string }[];
}

interface AdminProfileEditProps {
  profile: Profile;
  onProfileUpdated: () => void;
  onCancel: () => void;
}

export const AdminProfileEdit = ({ profile, onProfileUpdated, onCancel }: AdminProfileEditProps) => {
  const [fullName, setFullName] = useState(profile.full_name);
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsapp_number);
  const [visibilityDurationMonths, setVisibilityDurationMonths] = useState(profile.visibility_duration_months?.toString() || "1");
  const [existingImages, setExistingImages] = useState(profile.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const totalImages = existingImages.length + newImages.length;
      const availableSlots = 5 - totalImages;
      const filesToAdd = Array.from(files).slice(0, availableSlots);
      setNewImages([...newImages, ...filesToAdd]);
    }
  };

  const removeExistingImage = async (imageId: string, imageUrl: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      // Delete from storage
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-images')
          .remove([`admin/${fileName}`]);
      }

      setExistingImages(existingImages.filter(img => img.id !== imageId));
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          whatsapp_number: whatsappNumber,
          visibility_duration_months: parseInt(visibilityDurationMonths),
          visibility_start_date: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Upload new images
      if (newImages.length > 0) {
        const imageUrls = [];
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          const fileName = `${profile.id}-${Date.now()}-${i}.${file.name.split('.').pop()}`;
          
          const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(`admin/${fileName}`, file);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('profile-images')
            .getPublicUrl(`admin/${fileName}`);

          imageUrls.push(data.publicUrl);
        }

        // Save new image records
        const imageRecords = imageUrls.map((url, index) => ({
          profile_id: profile.id,
          image_url: url,
          image_order: existingImages.length + index + 1
        }));

        const { error: imagesError } = await supabase
          .from('profile_images')
          .insert(imageRecords);

        if (imagesError) throw imagesError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      onProfileUpdated();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
            Edit Profile: {profile.full_name}
          </CardTitle>
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-medium">Current Duration:</span> {profile.visibility_duration_months || 1} month(s)
            </div>
            <div>
              <span className="font-medium">Start Date:</span> {formatDate(profile.visibility_start_date)}
            </div>
            <div>
              <span className="font-medium">End Date:</span> {formatDate(profile.visibility_end_date)}
            </div>
          </div>
        </div>

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
              placeholder="+256701234567"
              required
            />
          </div>

          <div>
            <Label htmlFor="visibility">New Visibility Duration</Label>
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
            <p className="text-xs text-muted-foreground mt-1">
              Changing this will reset the start date to today
            </p>
          </div>

          <div>
            <Label>Profile Images ({existingImages.length + newImages.length}/5)</Label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Current Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.image_url}
                        alt="Current"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeExistingImage(image.id, image.image_url)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">New Images:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 p-0"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            {(existingImages.length + newImages.length) < 5 && (
              <div className="mt-4">
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
                      Click to add more images
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={updating} className="flex-1">
              {updating ? 'Updating Profile...' : 'Update Profile'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
