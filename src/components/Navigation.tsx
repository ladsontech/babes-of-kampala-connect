
import { Button } from "@/components/ui/button";
import { Users, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigation('/')}
        >
          <img 
            src="/images/logo.png" 
            alt="Kampala Babes Logo" 
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
          />
          <div className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Kampala Babes
          </div>
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
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
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
