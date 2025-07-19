
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();

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
              Profiles Created by Admin Only
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              User profiles are created and managed by our admin team. 
              Browse existing profiles to connect with amazing people.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Button 
            variant="gradient" 
            size="lg"
            onClick={() => navigate('/profiles')}
          >
            Browse Profiles
          </Button>
        </div>
      </div>
    </div>
  );
};
