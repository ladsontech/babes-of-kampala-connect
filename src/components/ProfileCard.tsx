
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Crown, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ProfileCardProps {
  name: string;
  images: {
    image_url: string;
  }[];
  whatsappNumber: string;
  location?: string;
  isPremium?: boolean;
}

export const ProfileCard = ({
  name,
  images,
  whatsappNumber,
  location = "Kampala",
  isPremium = false
}: ProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoSlideInterval = useRef<NodeJS.Timeout>();

  const handleWhatsAppClick = () => {
    const message = `Hi ${name}, I found your profile on Legit Escorts Uganda and would like to chat!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    const telUrl = `tel:${whatsappNumber}`;
    window.open(telUrl, '_self');
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsAutoSliding(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && images.length > 1) {
      prevImage();
    }

    // Resume auto-sliding after 3 seconds
    setTimeout(() => setIsAutoSliding(true), 3000);
  };

  const handleMouseEnter = () => {
    setIsAutoSliding(false);
  };

  const handleMouseLeave = () => {
    setIsAutoSliding(true);
  };

  // Auto-slide functionality
  useEffect(() => {
    if (images.length > 1 && isAutoSliding) {
      autoSlideInterval.current = setInterval(() => {
        nextImage();
      }, 4000);
    } else {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    }

    return () => {
      if (autoSlideInterval.current) {
        clearInterval(autoSlideInterval.current);
      }
    };
  }, [images.length, isAutoSliding]);

  if (images.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 bg-white/80 backdrop-blur-sm">
      <div className="relative">
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
            <Crown className="w-3 h-3" />
            PREMIUM
          </div>
        )}

        {/* Location Badge */}
        <div className="absolute top-3 right-3 z-20 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium shadow-lg">
          <MapPin className="w-3 h-3" />
          {location}
        </div>

        <div
          className="relative touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={images[currentImageIndex].image_url} 
            alt={name} 
            className="w-full h-96 sm:h-[28rem] md:h-[32rem] object-cover group-hover:scale-105 transition-transform duration-500" 
            style={{ aspectRatio: '3/4' }} 
            loading="lazy" 
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage} 
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" 
                aria-label="Previous image"
              >
                <span className="text-sm sm:text-base">←</span>
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" 
                aria-label="Next image"
              >
                <span className="text-sm sm:text-base">→</span>
              </button>
              <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Contact Options Overlay */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            onClick={handleWhatsAppClick} 
            size="sm" 
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg" 
            aria-label="Contact on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button 
            onClick={handleCallClick} 
            size="sm" 
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg" 
            aria-label="Call"
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-lg sm:text-xl font-bold truncate">{name}</h3>
          <p className="text-white/80 sm:text-3xl text-2xl">Contact: {whatsappNumber}</p>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4 space-y-2">
        <Button 
          onClick={handleWhatsAppClick} 
          variant="whatsapp" 
          className="w-full text-sm sm:text-base py-2.5 sm:py-3 transition-all duration-300 hover:scale-105" 
          size="sm"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-2">WhatsApp {name}</span>
        </Button>
        
        <Button 
          onClick={handleCallClick} 
          variant="outline" 
          className="w-full text-sm sm:text-base py-2.5 sm:py-3 transition-all duration-300 hover:scale-105" 
          size="sm"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-2">Call {name}</span>
        </Button>
      </CardContent>
    </Card>
  );
};
