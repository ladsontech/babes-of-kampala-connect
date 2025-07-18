import { Button } from "@/components/ui/button";
import { Heart, Users, Settings, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div 
          className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate('/')}
        >
          Kampala Babes
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant={location.pathname === '/profiles' ? 'default' : 'ghost'}
            onClick={() => navigate('/profiles')}
          >
            <Users className="w-4 h-4" />
            Browse
          </Button>
          
          {user ? (
            <>
              <Button
                variant={location.pathname === '/my-profile' ? 'default' : 'ghost'}
                onClick={() => navigate('/my-profile')}
              >
                <User className="w-4 h-4" />
                My Profile
              </Button>
              <Button
                variant="outline"
                onClick={signOut}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={location.pathname === '/signup' ? 'gradient' : 'outline'}
                onClick={() => navigate('/signup')}
              >
                <Heart className="w-4 h-4" />
                Join Now
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin')}
            className="opacity-50 hover:opacity-100"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
};