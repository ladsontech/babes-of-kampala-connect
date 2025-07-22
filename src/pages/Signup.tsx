
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();

  const handleContactAdmin = () => {
    const adminWhatsApp = "+256701007478";
    const message = "Hi! I'm interested in joining Kampala Babes. Could you please help me create a profile?";
    const whatsappUrl = `https://wa.me/${adminWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-accent/20 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Join Kampala Babes
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Contact our admin on WhatsApp to request membership. 
              Share your details and photos to get your profile created.
            </p>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">Contact Admin</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Send a WhatsApp message with your details:
            </p>
            <ul className="text-left text-sm text-muted-foreground mb-4 space-y-1">
              <li>• Full name</li>
              <li>• WhatsApp number</li>
              <li>• Profile photos (1-5 images)</li>
              <li>• Preferred membership duration</li>
            </ul>
            <p className="font-mono text-lg text-primary mb-6">+256 701 007478</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="whatsapp" 
              size="lg"
              onClick={handleContactAdmin}
              className="w-full hover:scale-105 transform transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              Send WhatsApp Message
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/profiles')}
              className="w-full"
            >
              Browse Existing Profiles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
