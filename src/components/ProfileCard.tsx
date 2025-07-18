import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

interface ProfileCardProps {
  name: string;
  images: { image_url: string }[];
  whatsappNumber: string;
}

export const ProfileCard = ({ name, images, whatsappNumber }: ProfileCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleWhatsAppClick = () => {
    const message = `Hi ${name}, I found your profile on Kampala Babes and would like to chat!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={images[currentImageIndex].image_url}
          alt={name}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              →
            </button>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{name}</h3>
        </div>
      </div>
      
      <CardContent className="p-4">
        <Button 
          onClick={handleWhatsAppClick}
          variant="gradient"
          className="w-full"
          size="sm"
        >
          <MessageCircle className="w-4 h-4" />
          Contact on WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};