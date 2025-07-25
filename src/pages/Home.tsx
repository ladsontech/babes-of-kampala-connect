
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, MessageCircle, Sparkles, Star } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { Navigation } from "@/components/Navigation";
import heroImage from "@/assets/hero-image.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  location: string;
  is_premium: boolean;
  images: {
    image_url: string;
  }[];
}

export const Home = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, whatsapp_number, location, is_premium, is_active, created_at')
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
            return { 
              ...profile, 
              images: [],
              location: profile.location || 'Kampala'
            };
          }

          return { 
            ...profile, 
            images: images || [],
            location: profile.location || 'Kampala'
          };
        })
      );

      setProfiles(profilesWithImages);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    const adminWhatsApp = "+256791735461";
    const message = "Hi! I'm interested in joining Legit Escorts Uganda. Could you please help me create a profile?";
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url(${heroImage})`
        }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-300/40 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-orange-300/30 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-6 md:mb-8">
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-pink-300 animate-pulse" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">Legit Escorts Uganda</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 md:mb-12 text-white/95 max-w-3xl mx-auto leading-relaxed font-light">
            Connect with amazing women in Kampala.<br />
            <span className="font-semibold bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">
              Contact admin to join our exclusive community.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button size="lg" variant="whatsapp" onClick={handleJoinClick} className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 hover:scale-110 transform transition-all duration-300 shadow-2xl">
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
              Request to Join
            </Button>
            <Button size="lg" variant="outline" className="text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 bg-white/10 border-white/40 text-white hover:bg-white/20 hover:scale-110 transform transition-all duration-300 backdrop-blur-sm" onClick={() => document.getElementById('profiles-section')?.scrollIntoView({
              behavior: 'smooth'
            })}>
              <Users className="w-5 h-5 md:w-6 md:h-6" />
              View Profiles
            </Button>
          </div>
        </div>
      </section>

      {/* Profiles Section - Main Focus */}
      <section id="profiles-section" className="py-12 md:py-20 bg-gradient-to-br from-background via-secondary/30 to-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Meet Amazing Women in Kampala
              </h2>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Connect directly with verified profiles through WhatsApp. All our members are active and looking to meet new people.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16 md:py-24">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-4 border-primary mx-auto mb-6"></div>
                  <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground text-lg">Loading amazing profiles...</p>
              </div>
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {profiles.map(profile => (
                <ProfileCard 
                  key={profile.id} 
                  name={profile.full_name} 
                  images={profile.images} 
                  whatsappNumber={profile.whatsapp_number}
                  location={profile.location}
                  isPremium={profile.is_premium}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 md:py-24">
              <div className="max-w-lg mx-auto">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl">
                  <Users className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Be the First to Join!</h3>
                <p className="text-muted-foreground mb-8 md:mb-10 text-base md:text-lg leading-relaxed">
                  Our community is just getting started. Contact our admin to create your profile and be among the first amazing women to join Legit Escorts Uganda.
                </p>
                <Button variant="whatsapp" size="lg" onClick={handleJoinClick} className="px-8 md:px-10 py-4 hover:scale-110 transform transition-all duration-300 shadow-xl">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  Contact Admin
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - Enhanced Design */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-secondary/40 via-background to-accent/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Why Choose Legit Escorts Uganda?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the best way to connect with amazing people in Kampala
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <Card className="text-center p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6 md:pt-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Verified Profiles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All profiles are manually reviewed and verified for authenticity and quality.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6 md:pt-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Direct Contact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect directly via WhatsApp with no intermediaries or complicated messaging systems.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6 md:pt-8">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
                  <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Safe & Secure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy and safety are our top priorities. All interactions are secure and respectful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-secondary/50 to-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-10 h-10 text-primary animate-pulse" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Join?
            </h2>
            <MessageCircle className="w-10 h-10 text-primary animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Contact our admin on WhatsApp to request membership. 
            Share your details including name, WhatsApp number, and photos to get started.
          </p>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 max-w-md mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Contact Admin</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Send a WhatsApp message to join Legit Escorts Uganda
              </p>
              <p className="font-mono text-lg text-primary">+256791735461</p>
            </div>
            <Button variant="whatsapp" size="lg" onClick={handleJoinClick} className="w-full hover:scale-105 transform transition-all duration-300">
              <MessageCircle className="w-5 h-5" />
              Send WhatsApp Message
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
