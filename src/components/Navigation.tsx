
import { Button } from "@/components/ui/button";
import { Heart, Users, Settings, User, LogOut, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div 
          className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          Kampala Babes
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Button
            variant={location.pathname === '/profiles' ? 'default' : 'ghost'}
            onClick={() => navigate('/profiles')}
            size="sm"
          >
            <Users className="w-4 h-4" />
            <span className="ml-2">Browse</span>
          </Button>
          
          {user ? (
            <>
              <Button
                variant={location.pathname === '/my-profile' ? 'default' : 'ghost'}
                onClick={() => navigate('/my-profile')}
                size="sm"
              >
                <User className="w-4 h-4" />
                <span className="ml-2">My Profile</span>
              </Button>
              <Button
                variant="outline"
                onClick={signOut}
                size="sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="ml-2">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
                size="sm"
                className="font-medium"
              >
                Sign In
              </Button>
              
              <Button
                variant="gradient"
                onClick={() => navigate('/signup')}
                size="sm"
                className="font-medium"
              >
                <Heart className="w-4 h-4" />
                <span className="ml-2">Join Now</span>
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="opacity-50 hover:opacity-100 p-2"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <Button
              variant={location.pathname === '/profiles' ? 'default' : 'ghost'}
              onClick={() => handleNavigation('/profiles')}
              className="w-full justify-start"
              size="sm"
            >
              <Users className="w-4 h-4" />
              <span className="ml-2">Browse Profiles</span>
            </Button>
            
            {user ? (
              <>
                <Button
                  variant={location.pathname === '/my-profile' ? 'default' : 'ghost'}
                  onClick={() => handleNavigation('/my-profile')}
                  className="w-full justify-start"
                  size="sm"
                >
                  <User className="w-4 h-4" />
                  <span className="ml-2">My Profile</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                  size="sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-2">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/auth')}
                  className="w-full justify-start font-medium"
                  size="sm"
                >
                  <User className="w-4 h-4" />
                  <span className="ml-2">Sign In</span>
                </Button>
                
                <Button
                  variant="gradient"
                  onClick={() => handleNavigation('/signup')}
                  className="w-full justify-start font-medium"
                  size="sm"
                >
                  <Heart className="w-4 h-4" />
                  <span className="ml-2">Join Now</span>
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/admin')}
              className="w-full justify-start opacity-50"
              size="sm"
            >
              <Settings className="w-4 h-4" />
              <span className="ml-2">Admin</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
