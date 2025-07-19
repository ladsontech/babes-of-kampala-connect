
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, MessageCircle } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { SignupForm } from "@/components/SignupForm";
import { Navigation } from "@/components/Navigation";
import heroImage from "@/assets/hero-image.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  images: { image_url: string }[];
}

export const Home = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          whatsapp_number,
          profile_images (
            image_url
          )
        `)
        .eq('is_active', true)
        .gte('subscription_end_date', new Date().toISOString());

      if (error) throw error;

      const formattedProfiles = profilesData?.map(profile => ({
        id: profile.id,
        full_name: profile.full_name,
        whatsapp_number: profile.whatsapp_number,
        images: profile.profile_images || []
      })) || [];

      setProfiles(formattedProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    document.getElementById('signup-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section - More compact on mobile */}
      <section className="relative h-[60vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Kampala Babes
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Connect with amazing women in Kampala. 
            Join our exclusive community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button 
              size="lg" 
              variant="gradient"
              onClick={handleJoinClick}
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
            >
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              Join Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => document.getElementById('profiles-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              View Profiles
            </Button>
          </div>
        </div>
      </section>

      {/* Profiles Section - Main Focus */}
      <section id="profiles-section" className="py-8 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
              Meet Amazing Women in Kampala
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect directly with verified profiles through WhatsApp. All our members are active and looking to meet new people.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12 md:py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading amazing profiles...</p>
              </div>
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {profiles.map(profile => (
                <ProfileCard
                  key={profile.id}
                  name={profile.full_name}
                  images={profile.images}
                  whatsappNumber={profile.whatsapp_number}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">Be the First to Join!</h3>
                <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
                  Our community is just getting started. Create your profile and be among the first amazing women to join Kampala Babes.
                </p>
                <Button variant="gradient" size="lg" onClick={handleJoinClick} className="px-6 md:px-8">
                  <Heart className="w-4 h-4 md:w-5 md:h-5" />
                  Create Your Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Condensed for mobile */}
      <section className="py-8 md:py-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 text-foreground">
            Why Choose Kampala Babes?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center p-4 md:p-6 hover:shadow-soft transition-shadow">
              <CardContent className="pt-4 md:pt-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Verified Profiles</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  All profiles are manually reviewed and verified for authenticity and quality.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 md:p-6 hover:shadow-soft transition-shadow">
              <CardContent className="pt-4 md:pt-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Direct Contact</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Connect directly via WhatsApp with no intermediaries or complicated messaging systems.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-4 md:p-6 hover:shadow-soft transition-shadow">
              <CardContent className="pt-4 md:pt-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Safe & Secure</h3>
                <p className="text-muted-foreground text-sm md:text-base">
                  Your privacy and safety are our top priorities. All interactions are secure and respectful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup-section" className="py-8 md:py-16 bg-gradient-to-br from-secondary/30 to-accent/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
              Ready to Join?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your profile and become part of Kampala's most exclusive community. 
              Your journey starts here.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <SignupForm />
          </div>
        </div>
      </section>
    </div>
  );
};
