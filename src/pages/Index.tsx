
import { useState, useEffect } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  is_active: boolean;
  is_premium: boolean;
  images: { image_url: string }[];
}

export default function Index() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch images for each profile
      const profilesWithImages = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { data: images, error: imagesError } = await supabase
            .from('profile_images')
            .select('image_url')
            .eq('profile_id', profile.id)
            .order('image_order');

          if (imagesError) {
            console.error('Error fetching images:', imagesError);
            return { ...profile, images: [] };
          }

          return { ...profile, images: images || [] };
        })
      );

      setProfiles(profilesWithImages);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Legit Escorts Uganda
            </h1>
            <p className="text-lg text-muted-foreground mb-8">Loading profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Legit Escorts Uganda
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Connect with verified companions across Uganda
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto shadow-soft">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Admin Contact:</strong>
            </p>
            <p className="font-mono text-sm">0791735461</p>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No profiles available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                name={profile.full_name}
                images={profile.images}
                whatsappNumber={profile.whatsapp_number}
                isPremium={profile.is_premium}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
