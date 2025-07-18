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
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Kampala Babes
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Connect with amazing women in Kampala. 
            Join our exclusive community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="gradient"
              onClick={handleJoinClick}
              className="text-lg px-8 py-6"
            >
              <Heart className="w-5 h-5" />
              Join Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => document.getElementById('profiles-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Users className="w-5 h-5" />
              View Profiles
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Kampala Babes?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Profiles</h3>
                <p className="text-muted-foreground">
                  All profiles are manually reviewed and verified for authenticity and quality.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Direct Contact</h3>
                <p className="text-muted-foreground">
                  Connect directly via WhatsApp with no intermediaries or complicated messaging systems.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-soft transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  Your privacy and safety are our top priorities. All interactions are secure and respectful.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profiles-section" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Our Community
          </h2>
          
          {loading ? (
            <div className="text-center">
              <p className="text-muted-foreground">Loading profiles...</p>
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No profiles available yet. Be the first to join our amazing community!
              </p>
              <Button variant="gradient" size="lg" onClick={handleJoinClick}>
                Join Now
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup-section" className="py-16 bg-gradient-to-br from-secondary/30 to-accent/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Ready to Join?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
