import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Palette,
  Type,
  Image as ImageIcon,
  PenTool,
  Trophy,
  Star,
  Award,
  Heart,
  Music,
  Zap,
  Crown,
  Flame,
  Gem,
  Medal,
  Save,
  RotateCcw,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ImageUpload } from '../../components/ImageUpload';
import { useToast } from '../../lib/toast';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { cn } from '../../lib/utils';

const iconMap = {
  Trophy,
  Star,
  Award,
  Heart,
  Music,
  Zap,
  Crown,
  Flame,
  Gem,
  Medal,
} as const;

type IconName = keyof typeof iconMap;

const defaultBranding = {
  primaryColor: '#c68a35',
  secondaryColor: '#1a1a1a',
  accentColor: '#10b981',
  categoryIcon: 'Trophy' as IconName,
  font: 'Serif',
  bannerImage: null as string | null,
  sponsorLogo: null as string | null,
  tagline: 'Celebrating musical excellence',
  description: '',
};

export function CategoryBranding() {
  const { eventId, categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [branding, setBranding] = useState(defaultBranding);

  const update = <K extends keyof typeof branding>(key: K, value: (typeof branding)[K]) =>
    setBranding((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast('Branding saved successfully!', 'success');
  };

  const handleReset = () => {
    if (window.confirm('Reset all branding to defaults?')) {
      setBranding(defaultBranding);
      toast('Branding reset to defaults', 'info');
    }
  };

  const IconComponent = iconMap[branding.categoryIcon];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-24">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/5">
            <Palette className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Palette className="h-4 w-4 text-gold-500" />
              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Visual Identity</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">
              Artiste of the Year <span className="text-dark-500 not-italic">/ Branding</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Editor */}
        <div className="space-y-6">
          {/* Colors */}
          <Card className="border-gold-500/20 bg-gold-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Palette className="h-4 w-4 text-gold-500" />
                Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['primaryColor', 'secondaryColor', 'accentColor'] as const).map((key) => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">
                    {key === 'primaryColor' ? 'Primary Color' : key === 'secondaryColor' ? 'Secondary Color' : 'Accent Color'}
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg border border-white/10 shrink-0"
                      style={{ backgroundColor: branding[key] }}
                    />
                    <input
                      type="color"
                      value={branding[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="sr-only"
                      id={key}
                    />
                    <input
                      type="text"
                      value={branding[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50 font-mono"
                      placeholder="#000000"
                    />
                    <label htmlFor={key} className="h-10 w-10 rounded-lg border border-white/10 cursor-pointer overflow-hidden hover:border-gold-500/50 transition-colors">
                      <input
                        type="color"
                        value={branding[key]}
                        onChange={(e) => update(key, e.target.value)}
                        className="w-full h-full cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="h-4 w-4 text-gold-500" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {(['Serif', 'Sans-serif', 'Monospace'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => update('font', f)}
                    className={cn(
                      'flex-1 py-3 rounded-xl border text-sm font-medium transition-all',
                      branding.font === f
                        ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                        : 'border-white/10 text-dark-400 hover:border-white/20'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gold-500" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-2 block">
                  Banner Image <span className="text-dark-600">(1200x400 recommended)</span>
                </label>
                <ImageUpload
                  label="Banner"
                  aspectRatio="video"
                  onImageSelect={(file) => {
                    if (file) {
                      const url = URL.createObjectURL(file);
                      update('bannerImage', url);
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-2 block">
                  Sponsor Logo <span className="text-dark-600">(400x200 recommended)</span>
                </label>
                <ImageUpload
                  label="Sponsor Logo"
                  aspectRatio="video"
                  onImageSelect={(file) => {
                    if (file) {
                      const url = URL.createObjectURL(file);
                      update('sponsorLogo', url);
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PenTool className="h-4 w-4 text-gold-500" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Category Tagline</label>
                <input
                  type="text"
                  value={branding.tagline}
                  onChange={(e) => update('tagline', e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50"
                  placeholder="Enter a tagline..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Category Description</label>
                <textarea
                  value={branding.description}
                  onChange={(e) => update('description', e.target.value)}
                  className="w-full min-h-[120px] bg-dark-900 border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50"
                  placeholder="Describe this category..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Icon Selector */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-4 w-4 text-gold-500" />
                Category Icon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(iconMap) as IconName[]).map((name) => {
                  const Icon = iconMap[name];
                  return (
                    <button
                      key={name}
                      onClick={() => update('categoryIcon', name)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                        branding.categoryIcon === name
                          ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                          : 'border-white/10 text-dark-400 hover:border-white/20 hover:text-white'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-[9px] uppercase tracking-wider">{name}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Full Preview */}
              <motion.div
                layout
                className="rounded-2xl overflow-hidden border shadow-2xl"
                style={{
                  borderColor: branding.accentColor,
                  backgroundColor: branding.primaryColor,
                }}
              >
                {branding.bannerImage ? (
                  <div className="h-48 overflow-hidden">
                    <img src={branding.bannerImage} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="h-48 flex items-center justify-center"
                    style={{ backgroundColor: branding.secondaryColor }}
                  >
                    <IconComponent
                      className="h-16 w-16 opacity-20"
                      style={{ color: branding.primaryColor }}
                    />
                  </div>
                )}
                <div className="p-6 space-y-3" style={{ backgroundColor: `${branding.secondaryColor}ee` }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      <IconComponent className="h-6 w-6" style={{ color: branding.secondaryColor }} />
                    </div>
                    <div>
                      <h3
                        className="font-bold text-lg"
                        style={{
                          fontFamily: branding.font === 'Serif' ? 'Georgia, serif' : branding.font === 'Monospace' ? 'monospace' : 'system-ui, sans-serif',
                          color: branding.primaryColor,
                        }}
                      >
                        Artiste of the Year
                      </h3>
                      <p
                        className="text-xs opacity-70"
                        style={{ color: branding.primaryColor }}
                      >
                        {branding.tagline}
                      </p>
                    </div>
                  </div>
                  {branding.description && (
                    <p
                      className="text-xs leading-relaxed pt-2 border-t"
                      style={{
                        color: `${branding.primaryColor}99`,
                        borderColor: `${branding.accentColor}33`,
                      }}
                    >
                      {branding.description}
                    </p>
                  )}
                  {branding.sponsorLogo && (
                    <div className="pt-3 border-t flex items-center gap-2" style={{ borderColor: `${branding.accentColor}33` }}>
                      <span className="text-[9px] uppercase tracking-widest opacity-50" style={{ color: branding.primaryColor }}>
                        Sponsored by
                      </span>
                      <img src={branding.sponsorLogo} alt="Sponsor" className="h-6" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Mini Preview */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-3">Mini Preview (List View)</p>
                <div
                  className="rounded-xl border p-3 flex items-center gap-3"
                  style={{
                    borderColor: `${branding.accentColor}33`,
                    backgroundColor: `${branding.secondaryColor}88`,
                  }}
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    <IconComponent className="h-5 w-5" style={{ color: branding.secondaryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-semibold truncate"
                      style={{
                        fontFamily: branding.font === 'Serif' ? 'Georgia, serif' : branding.font === 'Monospace' ? 'monospace' : 'system-ui, sans-serif',
                        color: branding.primaryColor,
                      }}
                    >
                      Artiste of the Year
                    </h4>
                    <p className="text-[10px] opacity-60 truncate" style={{ color: branding.primaryColor }}>
                      {branding.tagline}
                    </p>
                  </div>
                  {branding.sponsorLogo && (
                    <img src={branding.sponsorLogo} alt="" className="h-5 shrink-0 opacity-60" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save Branding
          </Button>
        </div>
      </div>
    </div>
  );
}
