import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { User, Save } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useToast } from '../../lib/toast';
import { ImageUpload } from '../../components/ImageUpload';

export function JudgeProfile() {
  const { user } = useAuth();
  const updateProfile = useMutation(api.users.mutations.updateProfile);
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [photoUrl, setPhotoUrl] = useState(user?.avatarUrl ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firebaseUid: user?.id,
        name,
        avatarUrl: photoUrl,
      });
      toast('Profile updated', 'success');
    } catch (e: any) {
      toast(e.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">My Profile</h1>
        <p className="text-dark-400 text-sm">Manage your judge profile information.</p>
      </div>

      {/* Photo */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {photoUrl ? (
                <img src={photoUrl} alt="" className="h-24 w-24 rounded-2xl object-cover border border-white/10" />
              ) : (
                <div className="h-24 w-24 rounded-2xl bg-gold-500/10 flex items-center justify-center border border-gold-500/20">
                  <User className="h-10 w-10 text-gold-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">Profile Photo</p>
              <ImageUpload
                onImageSelect={(url) => setPhotoUrl(url ?? '')}
                value={photoUrl}
                label="Upload Photo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-dark-600 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white block mb-2">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="w-full h-11 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-dark-500 text-sm cursor-not-allowed"
            />
            <p className="text-xs text-dark-500 mt-1">Email cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? (
            <span className="h-4 w-4 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Profile
        </Button>
      </div>
    </div>
  );
}
