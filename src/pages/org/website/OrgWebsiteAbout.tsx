import React from 'react';
import {
  MapPin, Calendar, Mail, Globe, Twitter, Instagram, Youtube,
  ExternalLink, Trophy, Users, HandHeart, CheckCircle2,
} from 'lucide-react';

function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors group">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold-500/10 transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm">{label}</span>
      <ExternalLink className="h-3 w-3 text-dark-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

interface OrgWebsiteAboutProps {
  org: any;
  sponsors: any[];
}

export function OrgWebsiteAbout({ org, sponsors }: OrgWebsiteAboutProps) {
  const socialLinks = org.socialLinks ?? {};

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <div className="space-y-6">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">About Us</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Our Mission</h2>
        <p className="text-dark-300 text-lg leading-relaxed">{org.description || 'Dedicated to recognizing and celebrating outstanding achievements in our community.'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
        {org.country && (
          <div className="space-y-3">
            <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Location</h4>
            <p className="text-dark-400 text-sm leading-relaxed flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {org.headquarters ? `${org.headquarters}, ` : ''}{org.country}
            </p>
          </div>
        )}
        {org.foundedYear && (
          <div className="space-y-3">
            <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Founded</h4>
            <p className="text-dark-400 text-sm leading-relaxed">Est. {org.foundedYear}</p>
          </div>
        )}
        {org.type && (
          <div className="space-y-3">
            <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Type</h4>
            <p className="text-dark-400 text-sm leading-relaxed capitalize">{org.type}</p>
          </div>
        )}
        {org.contactEmail && (
          <div className="space-y-3">
            <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Contact</h4>
            <p className="text-dark-400 text-sm leading-relaxed">{org.contactEmail}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6 pt-12 border-t border-white/5">
        <div className="text-center p-6 rounded-xl bg-dark-900/50 border border-white/5">
          <Users className="h-6 w-6 text-gold-500 mx-auto mb-3" />
          <p className="text-white font-serif text-2xl">{org.followerCount.toLocaleString()}</p>
          <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">Members</p>
        </div>
        <div className="text-center p-6 rounded-xl bg-dark-900/50 border border-white/5">
          <Trophy className="h-6 w-6 text-gold-500 mx-auto mb-3" />
          <p className="text-white font-serif text-2xl">{org.eventCount || 0}</p>
          <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">Awards</p>
        </div>
        <div className="text-center p-6 rounded-xl bg-dark-900/50 border border-white/5">
          <CheckCircle2 className="h-6 w-6 text-gold-500 mx-auto mb-3" />
          <p className="text-white font-serif text-2xl">{org.isVerified ? 'Yes' : 'No'}</p>
          <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">Verified</p>
        </div>
      </div>

      {(socialLinks.website || socialLinks.twitter || socialLinks.instagram || socialLinks.youtube) && (
        <div className="pt-12 border-t border-white/5 space-y-6">
          <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Connect With Us</h4>
          <div className="space-y-4">
            {socialLinks.website && <SocialLink href={socialLinks.website} icon={Globe} label="Official Website" />}
            {socialLinks.twitter && <SocialLink href={`https://x.com/${socialLinks.twitter}`} icon={Twitter} label="X (Twitter)" />}
            {socialLinks.instagram && <SocialLink href={`https://instagram.com/${socialLinks.instagram}`} icon={Instagram} label="Instagram" />}
            {socialLinks.youtube && <SocialLink href={`https://youtube.com/@${socialLinks.youtube}`} icon={Youtube} label="YouTube" />}
          </div>
        </div>
      )}

      {sponsors.length > 0 && (
        <div className="pt-12 border-t border-white/5 space-y-6">
          <h4 className="text-gold-500 text-xs font-bold uppercase tracking-widest">Our Partners</h4>
          <div className="space-y-4">
            {sponsors.map((sponsor) => (
              <a key={sponsor._id} href={sponsor.website || '#'} target={sponsor.website ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} className="h-10 w-10 rounded-lg object-cover" alt={sponsor.name} referrerPolicy="no-referrer" />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center font-serif text-gold-500 text-sm">
                    {sponsor.name[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{sponsor.name}</p>
                  <span className="text-[10px] text-dark-500 uppercase tracking-widest">{sponsor.level}</span>
                </div>
                <ExternalLink className="h-3 w-3 text-dark-600 group-hover:text-gold-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
