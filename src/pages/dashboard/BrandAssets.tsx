import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Palette, Upload, Image as ImageIcon, Check } from 'lucide-react';
import { useAuth } from '../../lib/convex-auth';

export function BrandAssets() {
  const { currentOrg } = useAuth();

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-tight mb-2">Brand Assets</h1>
        <p className="text-dark-400 text-sm">Manage your organization's visual identity and brand materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-gold-500" />
              Organization Logo
            </CardTitle>
            <CardDescription>Your primary brand mark displayed across the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-2xl bg-dark-800 border border-white/10 flex items-center justify-center overflow-hidden">
                {currentOrg?.logoUrl ? (
                  <img src={currentOrg.logoUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-dark-600" />
                )}
              </div>
              <div>
                <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-dark-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <Upload className="h-3.5 w-3.5" /> Upload Logo
                </button>
                <p className="text-[10px] text-dark-500 mt-2">PNG, SVG, or JPG. Max 2MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-gold-500" />
              Brand Colors
            </CardTitle>
            <CardDescription>Your organization's color palette.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {['#c68a35', '#1a1a1a', '#ffffff'].map((color) => (
                  <div
                    key={color}
                    className="h-12 w-12 rounded-xl border border-white/10 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <Check className="h-4 w-4 text-white/50" />
                  </div>
                ))}
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-dark-400 hover:text-gold-500 transition-colors">
                Edit Colors
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gold-500" />
              Cover Photo
            </CardTitle>
            <CardDescription>Banner displayed on your public profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[3/1] rounded-xl bg-dark-800 border border-dashed border-white/10 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-dark-600 mx-auto mb-2" />
                <button className="text-[10px] font-bold uppercase tracking-widest text-gold-500 hover:underline">
                  Upload Cover Photo
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5 text-gold-500" />
              Brand Fonts
            </CardTitle>
            <CardDescription>Typography used across your materials.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-sm text-white font-serif">Primary Font</span>
                <span className="text-xs text-dark-400">Inter</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-sm text-white font-serif italic">Display Font</span>
                <span className="text-xs text-dark-400">Playfair Display</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
