import { SignupForm } from "@/components/SignupForm";
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
              Join Kampala Babes
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Create your profile and connect with our amazing community. 
              Your profile will be reviewed before going live.
            </p>
          </div>
        </div>
        
        <SignupForm />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            By submitting your profile, you agree to our terms of service and privacy policy. 
            Your profile will be reviewed by our admin team before being published.
          </p>
          <p className="mt-2">
            For subscription and payment information, you'll be contacted via WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};