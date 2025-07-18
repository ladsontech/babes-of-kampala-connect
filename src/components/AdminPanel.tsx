import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Calendar, MessageCircle } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  images: string[];
  isActive: boolean;
  subscriptionEnds?: Date;
  submittedAt: Date;
}

// Mock data for demo
const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Sarah Nakimera",
    email: "sarah@example.com",
    whatsappNumber: "+256712345678",
    images: ["https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"],
    isActive: true,
    subscriptionEnds: new Date(2024, 11, 15),
    submittedAt: new Date(2024, 6, 10)
  },
  {
    id: "2", 
    name: "Grace Mirembe",
    email: "grace@example.com",
    whatsappNumber: "+256787654321",
    images: ["https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400"],
    isActive: false,
    submittedAt: new Date(2024, 6, 12)
  }
];

export const AdminPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);

  const toggleProfileVisibility = (profileId: string) => {
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId 
        ? { ...profile, isActive: !profile.isActive }
        : profile
    ));
  };

  const activateSubscription = (profileId: string, months: number) => {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);
    
    setProfiles(prev => prev.map(profile => 
      profile.id === profileId 
        ? { 
            ...profile, 
            isActive: true,
            subscriptionEnds: endDate
          }
        : profile
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (profile: Profile) => {
    if (!profile.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (!profile.subscriptionEnds) {
      return <Badge variant="outline">No Subscription</Badge>;
    }
    
    const now = new Date();
    const timeLeft = profile.subscriptionEnds.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (daysLeft <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    }
    
    return <Badge className="bg-green-500 text-white">Active</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
            Admin Panel - Kampala Babes
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profiles.map(profile => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {profile.images[0] && (
                        <img 
                          src={profile.images[0]} 
                          alt={profile.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted: {formatDate(profile.submittedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(profile)}
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={profile.isActive}
                          onCheckedChange={() => toggleProfileVisibility(profile.id)}
                        />
                        {profile.isActive ? 
                          <Eye className="w-4 h-4 text-green-500" /> : 
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        }
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedProfile(profile)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manage Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  {selectedProfile.images[0] && (
                    <img 
                      src={selectedProfile.images[0]} 
                      alt={selectedProfile.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                  )}
                  <h3 className="font-semibold">{selectedProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProfile.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Visibility:</span>
                    <Switch
                      checked={selectedProfile.isActive}
                      onCheckedChange={() => toggleProfileVisibility(selectedProfile.id)}
                    />
                  </div>

                  {selectedProfile.subscriptionEnds && (
                    <div className="text-sm">
                      <span>Subscription ends:</span>
                      <p className="font-medium">
                        {formatDate(selectedProfile.subscriptionEnds)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Activate Subscription</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Duration (months)</label>
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        value={subscriptionMonths}
                        onChange={(e) => setSubscriptionMonths(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <Button
                      variant="gradient"
                      className="w-full"
                      onClick={() => activateSubscription(selectedProfile.id, subscriptionMonths)}
                    >
                      <Calendar className="w-4 h-4" />
                      Activate {subscriptionMonths} Month{subscriptionMonths > 1 ? 's' : ''}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="whatsapp"
                  className="w-full"
                  onClick={() => window.open(`https://wa.me/${selectedProfile.whatsappNumber}`, '_blank')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact on WhatsApp
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};