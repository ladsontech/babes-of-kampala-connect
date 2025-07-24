import { useEffect, useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  images: { image_url: string }[];
}

export const Profiles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

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
        profilesData.map(async (profile) => {
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
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProfiles = profiles.filter(profile =>
    profile.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Legit Escorts Uganda
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with amazing women from Uganda. Tap any profile to start chatting on WhatsApp!
            </p>
          </div>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading profiles...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchTerm ? 'No profiles match your search.' : 'No active profiles available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProfiles.map(profile => (
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
        
        <div className="text-center mt-12">
          <div className="bg-gradient-secondary/20 rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-4">Want to join our community?</h3>
            <p className="text-muted-foreground mb-4">
              Create your profile and start connecting with amazing people today
            </p>
            <Button 
              variant="gradient" 
              size="lg"
              onClick={() => navigate('/signup')}
            >
              Join Legit Escorts Uganda
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
