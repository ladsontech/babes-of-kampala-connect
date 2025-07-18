import { useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demo
const allProfiles = [
  {
    id: "1",
    name: "Sarah Nakimera",
    images: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
    whatsappNumber: "+256712345678",
    isActive: true,
    subscriptionEnds: new Date(2024, 11, 15)
  },
  {
    id: "2", 
    name: "Grace Mirembe",
    images: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400"],
    whatsappNumber: "+256787654321",
    isActive: true,
    subscriptionEnds: new Date(2024, 10, 20)
  },
  {
    id: "3",
    name: "Joan Nalwanga",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"],
    whatsappNumber: "+256798765432",
    isActive: true,
    subscriptionEnds: new Date(2025, 0, 10)
  },
  {
    id: "4",
    name: "Maria Kiggundu",
    images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
    whatsappNumber: "+256701234567",
    isActive: true,
    subscriptionEnds: new Date(2024, 9, 30)
  },
  {
    id: "5",
    name: "Ruth Nabasirye",
    images: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
    whatsappNumber: "+256756789012",
    isActive: true,
    subscriptionEnds: new Date(2024, 11, 25)
  },
  {
    id: "6",
    name: "Diana Ssempa",
    images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400"],
    whatsappNumber: "+256789012345",
    isActive: true,
    subscriptionEnds: new Date(2025, 1, 5)
  }
];

export const Profiles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProfiles = allProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) && profile.isActive
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
              All Profiles
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse and connect with amazing women in our community
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
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfiles.map(profile => (
            <ProfileCard key={profile.id} {...profile} />
          ))}
        </div>
        
        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchTerm ? 'No profiles match your search.' : 'No active profiles found.'}
            </p>
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
              Join Kampala Babes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};