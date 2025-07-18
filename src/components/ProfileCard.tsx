import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock } from "lucide-react";

interface ProfileCardProps {
  id: string;
  name: string;
  images: string[];
  whatsappNumber: string;
  isActive: boolean;
  subscriptionEnds?: Date;
}

export const ProfileCard = ({ 
  name, 
  images, 
  whatsappNumber, 
  isActive,
  subscriptionEnds 
}: ProfileCardProps) => {
  const handleWhatsAppContact = () => {
    const message = `Hi ${name}, I found your profile on Kampala Babes and would like to connect with you!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  const formatSubscriptionTime = () => {
    if (!subscriptionEnds) return null;
    const now = new Date();
    const timeLeft = subscriptionEnds.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) return "Expired";
    if (daysLeft === 1) return "1 day left";
    if (daysLeft <= 30) return `${daysLeft} days left`;
    
    const monthsLeft = Math.ceil(daysLeft / 30);
    return `${monthsLeft} month${monthsLeft > 1 ? 's' : ''} left`;
  };

  if (!isActive) return null;

  return (
    <Card className="overflow-hidden hover:shadow-soft transition-shadow duration-300 group">
      <div className="relative">
        {images.length > 0 && (
          <div className="aspect-[3/4] overflow-hidden bg-gradient-secondary">
            <img 
              src={images[0]} 
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        {subscriptionEnds && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatSubscriptionTime()}
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-3 text-foreground">{name}</h3>
        
        <Button 
          onClick={handleWhatsAppContact}
          variant="whatsapp"
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