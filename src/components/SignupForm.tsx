import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface SignupData {
  fullName: string;
  email: string;
  whatsappNumber: string;
  images: File[];
}

export const SignupForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    email: "",
    whatsappNumber: "+256",
    images: []
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images",
        variant: "destructive"
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const uploadImage = async (file: File, userId: string, profileId: string, order: number) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${profileId}_${order}.${fileExt}`;
    
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
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a profile",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.fullName || !formData.email || !formData.whatsappNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one profile image",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          whatsapp_number: formData.whatsappNumber,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Upload images and create image records
      for (let i = 0; i < formData.images.length; i++) {
        const imageUrl = await uploadImage(formData.images[i], user.id, profile.id, i + 1);
        
        const { error: imageError } = await supabase
          .from('profile_images')
          .insert({
            profile_id: profile.id,
            image_url: imageUrl,
            image_order: i + 1
          });

        if (imageError) throw imageError;
      }

      toast({
        title: "Profile created!",
        description: "Your profile has been submitted for admin review.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error creating profile",
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
        <CardTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
          Join Kampala Babes
        </CardTitle>
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
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Email Address *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your.email@example.com"
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
              {formData.images.length < 5 && (
                <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Upload image ({formData.images.length}/5)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    multiple
                  />
                </label>
              )}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating Profile..." : "Submit Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};