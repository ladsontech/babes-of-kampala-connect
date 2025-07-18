import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff, Calendar, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  whatsapp_number: string;
  is_active: boolean;
  subscription_end_date?: string;
  created_at: string;
  images: { id: string; image_url: string; image_order: number }[];
}

export const AdminPanel = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch images for each profile
      const profilesWithImages = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: images, error: imagesError } = await supabase
            .from('profile_images')
            .select('*')
            .eq('profile_id', profile.id)
            .order('image_order');

          if (imagesError) {
            console.error('Error fetching images:', imagesError);
            return { ...profile, images: [] };
          }

          return { ...profile, images: images || [] };
        })
      );

      setProfiles(profilesWithImages);
    } catch (error: any) {
      toast({
        title: "Error loading profiles",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProfileVisibility = async (profileId: string) => {
    try {
      const profile = profiles.find(p => p.id === profileId);
      if (!profile) return;

      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !profile.is_active })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.map(p => 
        p.id === profileId 
          ? { ...p, is_active: !p.is_active }
          : p
      ));

      if (selectedProfile?.id === profileId) {
        setSelectedProfile({ ...selectedProfile, is_active: !selectedProfile.is_active });
      }

      toast({
        title: `Profile ${profile.is_active ? 'hidden' : 'activated'}`,
        description: `${profile.full_name}'s profile is now ${profile.is_active ? 'hidden' : 'visible'}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const activateSubscription = async (profileId: string, months: number) => {
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + months);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_end_date: endDate.toISOString(),
          is_active: true 
        })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { 
              ...profile, 
              subscription_end_date: endDate.toISOString(),
              is_active: true 
            }
          : profile
      ));

      if (selectedProfile?.id === profileId) {
        setSelectedProfile({
          ...selectedProfile,
          subscription_end_date: endDate.toISOString(),
          is_active: true
        });
      }

      const profile = profiles.find(p => p.id === profileId);
      toast({
        title: "Subscription activated",
        description: `${profile?.full_name}'s subscription set for ${months} month${months > 1 ? 's' : ''}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating subscription",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (profile: Profile) => {
    if (!profile.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    
    if (!profile.subscription_end_date) {
      return <Badge variant="outline">No Subscription</Badge>;
    }
    
    const now = new Date();
    const endDate = new Date(profile.subscription_end_date);
    const timeLeft = endDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    
    if (daysLeft <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>;
    }
    
    return <Badge className="bg-green-500 text-white">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-center text-muted-foreground">Loading profiles...</p>
      </div>
    );
  }

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
              <CardTitle className="text-lg">All Profiles ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profiles.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No profiles found.</p>
                ) : (
                  profiles.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {profile.images[0] && (
                          <img 
                            src={profile.images[0].image_url} 
                            alt={profile.full_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{profile.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{profile.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {formatDate(profile.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getStatusBadge(profile)}
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={profile.is_active}
                            onCheckedChange={() => toggleProfileVisibility(profile.id)}
                          />
                          {profile.is_active ? 
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
                  ))
                )}
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
                      src={selectedProfile.images[0].image_url} 
                      alt={selectedProfile.full_name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                    />
                  )}
                  <h3 className="font-semibold">{selectedProfile.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProfile.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Visibility:</span>
                    <Switch
                      checked={selectedProfile.is_active}
                      onCheckedChange={() => toggleProfileVisibility(selectedProfile.id)}
                    />
                  </div>

                  {selectedProfile.subscription_end_date && (
                    <div className="text-sm">
                      <span>Subscription ends:</span>
                      <p className="font-medium">
                        {formatDate(selectedProfile.subscription_end_date)}
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
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://wa.me/${selectedProfile.whatsapp_number}`, '_blank')}
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