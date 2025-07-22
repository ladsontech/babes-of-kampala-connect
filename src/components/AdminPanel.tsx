import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Trash2, Plus, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminProfileForm } from "./AdminProfileForm";
import { AdminProfileEdit } from "./AdminProfileEdit";

interface DatabaseProfile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscription_end_date: string | null;
  visibility_duration_months?: number;
  visibility_start_date?: string;
  visibility_end_date?: string;
}

interface Profile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscription_end_date: string | null;
  visibility_duration_months?: number;
  visibility_start_date?: string;
  visibility_end_date?: string;
  images: { id: string; image_url: string }[];
}

export const AdminPanel = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

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
        (profilesData || []).map(async (profile: DatabaseProfile) => {
          const { data: images, error: imagesError } = await supabase
            .from('profile_images')
            .select('id, image_url')
            .eq('profile_id', profile.id)
            .order('image_order');

          if (imagesError) {
            console.error('Error fetching images:', imagesError);
            return { 
              ...profile, 
              images: [],
              visibility_duration_months: profile.visibility_duration_months || 1,
              visibility_start_date: profile.visibility_start_date || new Date().toISOString(),
              visibility_end_date: profile.visibility_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
          }

          return { 
            ...profile, 
            images: images || [],
            visibility_duration_months: profile.visibility_duration_months || 1,
            visibility_start_date: profile.visibility_start_date || new Date().toISOString(),
            visibility_end_date: profile.visibility_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
        })
      );

      setProfiles(profilesWithImages);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProfileStatus = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { ...profile, is_active: !currentStatus }
          : profile
      ));

      toast({
        title: "Success",
        description: `Profile ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    try {
      // First, get the profile images to delete from storage
      const { data: images } = await supabase
        .from('profile_images')
        .select('image_url')
        .eq('profile_id', profileId);

      // Delete images from storage
      if (images && images.length > 0) {
        for (const image of images) {
          const fileName = image.image_url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('profile-images')
              .remove([`admin/${fileName}`]);
          }
        }
      }

      // Delete profile images records
      const { error: imagesError } = await supabase
        .from('profile_images')
        .delete()
        .eq('profile_id', profileId);

      if (imagesError) throw imagesError;

      // Delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (profileError) throw profileError;

      // Update local state
      setProfiles(profiles.filter(profile => profile.id !== profileId));

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
  };

  const handleCancelEdit = () => {
    setEditingProfile(null);
  };

  const handleProfileUpdated = () => {
    setEditingProfile(null);
    fetchProfiles();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage profiles and site content
        </p>
      </div>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="profiles" className="text-xs sm:text-sm">
            Manage Profiles ({profiles.length})
          </TabsTrigger>
          <TabsTrigger value="create" className="text-xs sm:text-sm">
            <Plus className="w-4 h-4 mr-1" />
            Create Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <AdminProfileForm onProfileCreated={fetchProfiles} />
        </TabsContent>

        <TabsContent value="profiles">
          {editingProfile ? (
            <AdminProfileEdit 
              profile={editingProfile}
              onProfileUpdated={handleProfileUpdated}
              onCancel={handleCancelEdit}
            />
          ) : (
            <>
              {profiles.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No profiles found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {profiles.map(profile => (
                    <Card key={profile.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <CardTitle className="text-lg sm:text-xl">{profile.full_name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={profile.is_active ? "default" : "secondary"} className="text-xs">
                                {profile.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProfile(profile)}
                              className="p-2"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProfileStatus(profile.id, profile.is_active)}
                              className="p-2"
                            >
                              {profile.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteProfile(profile.id)}
                              className="p-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">WhatsApp</p>
                            <p className="font-mono">{profile.whatsapp_number}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Created</p>
                            <p>{new Date(profile.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {profile.visibility_duration_months && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Duration</p>
                              <p>{profile.visibility_duration_months} month(s)</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Start Date</p>
                              <p>{profile.visibility_start_date ? new Date(profile.visibility_start_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">End Date</p>
                              <p>{profile.visibility_end_date ? new Date(profile.visibility_end_date).toLocaleDateString() : 'N/A'}</p>
                            </div>
                          </div>
                        )}
                        
                        {profile.images.length > 0 && (
                          <div>
                            <p className="font-medium text-muted-foreground mb-2 text-sm">Images ({profile.images.length})</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                              {profile.images.map((image, index) => (
                                <img
                                  key={image.id}
                                  src={image.image_url}
                                  alt={`${profile.full_name} ${index + 1}`}
                                  className="w-full h-16 sm:h-20 object-cover rounded-md"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
