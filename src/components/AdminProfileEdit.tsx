import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
  user_id: string | null;
  email: string | null;
  images: { id: string; image_url: string }[];
}

interface AdminProfileEditProps {
  profile: Profile;
  onProfileUpdated: () => void;
  onCancel: () => void;
}

export const AdminProfileEdit = ({ profile, onProfileUpdated, onCancel }: AdminProfileEditProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.full_name,
    whatsappNumber: profile.whatsapp_number,
  });
  const [existingImages, setExistingImages] = useState(profile.images);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images",
        variant: "destructive"
      });
      return;
    }
    
    setNewImages(prev => [...prev, ...files]);
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setExistingImages(prev => prev.filter(img => img.id !== imageId));

      toast({
        title: "Image removed",
        description: "Image has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing image",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File, profileId: string, order: number) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `admin/${profileId}_${order}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.whatsappNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Update profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          whatsapp_number: formData.whatsappNumber,
        })
        .eq('id', profile.id);

      if (profileError) throw profileError;

      // Upload new images
      for (let i = 0; i < newImages.length; i++) {
        const newOrder = existingImages.length + i + 1;
        const imageUrl = await uploadImage(newImages[i], profile.id, newOrder);
        
        const { error: imageError } = await supabase
          .from('profile_images')
          .insert({
            profile_id: profile.id,
            image_url: imageUrl,
            image_order: newOrder
          });

        if (imageError) throw imageError;
      }

      toast({
        title: "Profile updated!",
        description: "Profile has been successfully updated.",
      });

      onProfileUpdated();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
            Edit Profile
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Full Name *
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              WhatsApp Number *
            </label>
            <Input
              value={formData.whatsappNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="+256712345678"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Profile Images * (1-5 images)
            </label>
            
            <div className="space-y-3">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt="Profile"
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {newImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {(existingImages.length + newImages.length) < 5 && (
                <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Add image ({existingImages.length + newImages.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gradient" className="flex-1" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
