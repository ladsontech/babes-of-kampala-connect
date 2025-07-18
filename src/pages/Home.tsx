import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, MessageCircle } from "lucide-react";
import { ProfileCard } from "@/components/ProfileCard";
import { SignupForm } from "@/components/SignupForm";
import { Navigation } from "@/components/Navigation";
import heroImage from "@/assets/hero-image.jpg";

// Mock data for demo
const featuredProfiles = [
  {
    id: "1",
    name: "Sarah Nakimera",
    images: [{ image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400" }],
    whatsappNumber: "+256712345678",
    isActive: true,
    subscriptionEnds: new Date(2024, 11, 15)
  },
  {
    id: "2", 
    name: "Grace Mirembe",
    images: [{ image_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400" }],
    whatsappNumber: "+256787654321",
    isActive: true,
    subscriptionEnds: new Date(2024, 10, 20)
  },
  {
    id: "3",
    name: "Joan Nalwanga",
    images: [{ image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" }],
    whatsappNumber: "+256798765432",
    isActive: true,
    subscriptionEnds: new Date(2025, 0, 10)
  }
];

export const Home = () => {
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

      {/* Featured Profiles Section */}
      <section id="profiles-section" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Featured Profiles
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProfiles.map(profile => (
              <ProfileCard key={profile.id} {...profile} />
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Join our community to view all profiles and connect with amazing women
            </p>
            <Button variant="gradient" size="lg" onClick={handleJoinClick}>
              View All Profiles
            </Button>
          </div>
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
