
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, ArrowLeft } from "lucide-react";

interface AdminProfileEditProps {
  profile: {
    id: string;
    full_name: string;
    whatsapp_number: string;
    location: string;
    visibility_duration_weeks: number;
    is_premium: boolean;
    images: { id: string; image_url: string }[];
  };
  onProfileUpdated: () => void;
  onCancel: () => void;
}

const UGANDA_CITIES = [
  "Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu", "Arua", "Mbale", "Fort Portal", 
  "Lira", "Masaka", "Soroti", "Hoima", "Kabale", "Bushenyi", "Moroto", "Tororo", 
  "Kasese", "Wakiso", "Mukono", "Iganga", "Masindi", "Lugazi", "Kitgum", "Pallisa", 
  "Njeru", "Nebbi", "Apac", "Ntungamo", "Kamuli", "Kiryandongo"
];

export const AdminProfileEdit = ({ profile, onProfileUpdated, onCancel }: AdminProfileEditProps) => {
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    whatsapp_number: profile.whatsapp_number,
    location: profile.location || "Kampala",
    visibility_duration_weeks: profile.visibility_duration_weeks,
    is_premium: profile.is_premium
  });
  const [existingImages, setExistingImages] = useState(profile.images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: "Too many images",
        description: "Maximum 5 images allowed",
        variant: "destructive"
      });
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
  };

  const removeExistingImage = async (imageId: string, imageUrl: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Delete from storage
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('profile-images')
          .remove([`admin/${fileName}`]);
      }

      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      
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
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate visibility dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (formData.visibility_duration_weeks * 7));

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          whatsapp_number: formData.whatsapp_number,
          location: formData.location,
          visibility_duration_weeks: formData.visibility_duration_weeks,
          visibility_start_date: startDate.toISOString(),
          visibility_end_date: endDate.toISOString(),
          is_premium: formData.is_premium,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Upload new images
      const imagePromises = newImages.map(async (image, index) => {
        const fileName = `${profile.id}_${Date.now()}_${index}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(`admin/${fileName}`, image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(`admin/${fileName}`);

        return supabase
          .from('profile_images')
          .insert({
            profile_id: profile.id,
            image_url: publicUrl,
            image_order: existingImages.length + index
          });
      });

      await Promise.all(imagePromises);

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      onProfileUpdated();

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle>Edit Profile: {profile.full_name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={formData.location}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, location: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {UGANDA_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="visibility_duration">Visibility Duration</Label>
            <Select
              value={formData.visibility_duration_weeks.toString()}
              onValueChange={(value) => 
                setFormData(prev => ({ ...prev, visibility_duration_weeks: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Week</SelectItem>
                <SelectItem value="2">2 Weeks</SelectItem>
                <SelectItem value="4">4 Weeks</SelectItem>
                <SelectItem value="8">8 Weeks</SelectItem>
                <SelectItem value="12">12 Weeks</SelectItem>
                <SelectItem value="24">24 Weeks</SelectItem>
                <SelectItem value="48">48 Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_premium"
              checked={formData.is_premium}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, is_premium: checked === true }))
              }
            />
            <Label htmlFor="is_premium">Premium Profile</Label>
          </div>

          <div>
            <Label>Current Images</Label>
            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.image_url}
                      alt="Profile"
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeExistingImage(image.id, image.image_url)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <Label htmlFor="new_images">Add New Images</Label>
            <Input
              id="new_images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="mb-4"
            />
            
            {newImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeNewImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
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
