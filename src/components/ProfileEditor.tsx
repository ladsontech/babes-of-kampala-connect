import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  full_name: string;
  whatsapp_number: string;
  images: { id: string; image_url: string; image_order: number }[];
}

interface NewImage {
  file: File;
  preview: string;
}

export const ProfileEditor = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Use maybeSingle() instead of single() to handle cases with no records
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        // No profile exists, show create form
        setIsCreating(true);
        setProfileData({
          id: '',
          full_name: '',
          whatsapp_number: '',
          images: []
        });
        return;
      }

      const { data: images, error: imagesError } = await supabase
        .from('profile_images')
        .select('*')
        .eq('profile_id', profile.id)
        .order('image_order');

      if (imagesError) throw imagesError;

      setProfileData({
        id: profile.id,
        full_name: profile.full_name,
        whatsapp_number: profile.whatsapp_number,
        images: images || []
      });
      setIsCreating(false);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = (profileData?.images.length || 0) + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: "Too many images",
        description: "You can have maximum 5 images",
        variant: "destructive"
      });
      return;
    }
    
    const newImageFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setProfileData(prev => prev ? {
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      } : null);

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
    const fileName = `${user!.id}/${profileId}_${Date.now()}_${order}.${fileExt}`;
    
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
    
    if (!profileData) return;

    setLoading(true);

    try {
      let profileId = profileData.id;

      if (isCreating) {
        // Create new profile
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            full_name: profileData.full_name,
            whatsapp_number: profileData.whatsapp_number,
          })
          .select()
          .single();

        if (createError) throw createError;
        profileId = newProfile.id;
        setIsCreating(false);
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: profileData.full_name,
            whatsapp_number: profileData.whatsapp_number,
          })
          .eq('id', profileData.id);

        if (updateError) throw updateError;
      }

      // Upload new images
      for (let i = 0; i < newImages.length; i++) {
        const newOrder = profileData.images.length + i + 1;
        const imageUrl = await uploadImage(newImages[i].file, profileId, newOrder);
        
        const { error: imageError } = await supabase
          .from('profile_images')
          .insert({
            profile_id: profileId,
            image_url: imageUrl,
            image_order: newOrder
          });

        if (imageError) throw imageError;
      }

      setNewImages([]);
      await fetchProfile();

      toast({
        title: isCreating ? "Profile created!" : "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      console.error('Profile save error:', error);
      toast({
        title: isCreating ? "Error creating profile" : "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
          {isCreating ? 'Create Your Profile' : 'Edit Your Profile'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Full Name *
            </label>
            <Input
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => prev ? { ...prev, full_name: e.target.value } : null)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              WhatsApp Number *
            </label>
            <Input
              value={profileData.whatsapp_number}
              onChange={(e) => setProfileData(prev => prev ? { ...prev, whatsapp_number: e.target.value } : null)}
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
              {profileData.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {profileData.images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={`Profile ${image.image_order}`}
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
                  {newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
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
              {(profileData.images.length + newImages.length) < 5 && (
                <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Add image ({profileData.images.length + newImages.length}/5)
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

          <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
            {loading ? (isCreating ? "Creating Profile..." : "Updating Profile...") : (isCreating ? "Create Profile" : "Save Changes")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
