import React from 'react';
import { Mail, MapPin, Phone, Globe, Twitter, Instagram, Youtube, ExternalLink, Send } from 'lucide-react';

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

interface OrgWebsiteContactProps {
  org: any;
}

export function OrgWebsiteContact({ org }: OrgWebsiteContactProps) {
  const socialLinks = org.socialLinks ?? {};
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <p className="text-[10px] text-gold-500 font-bold uppercase tracking-[0.3em]">Contact</p>
        <h2 className="text-3xl md:text-4xl font-serif text-white italic">Get in Touch</h2>
        <p className="text-dark-400 text-sm max-w-lg mx-auto">We'd love to hear from you. Reach out with any questions or inquiries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-lg font-serif text-white">Contact Information</h3>
          <div className="space-y-4">
            {org.contactEmail && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-0.5">Email</p>
                  <a href={`mailto:${org.contactEmail}`} className="text-dark-300 text-sm hover:text-gold-400 transition-colors">{org.contactEmail}</a>
                </div>
              </div>
            )}
            {org.phone && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-0.5">Phone</p>
                  <span className="text-dark-300 text-sm">{org.phone}</span>
                </div>
              </div>
            )}
            {(org.headquarters || org.country) && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-gold-500" />
                </div>
                <div>
                  <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-0.5">Location</p>
                  <span className="text-dark-300 text-sm">{org.headquarters ? `${org.headquarters}, ` : ''}{org.country}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <p className="text-[10px] text-dark-500 uppercase tracking-widest">Follow Us</p>
            <div className="space-y-3">
              {socialLinks.website && <SocialLink href={socialLinks.website} icon={Globe} label="Website" />}
              {socialLinks.twitter && <SocialLink href={`https://x.com/${socialLinks.twitter}`} icon={Twitter} label="X (Twitter)" />}
              {socialLinks.instagram && <SocialLink href={`https://instagram.com/${socialLinks.instagram}`} icon={Instagram} label="Instagram" />}
              {socialLinks.youtube && <SocialLink href={`https://youtube.com/@${socialLinks.youtube}`} icon={Youtube} label="YouTube" />}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-dark-900/50 border border-white/5 space-y-5">
          <h3 className="text-lg font-serif text-white">Send a Message</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                className="w-full h-10 rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                className="w-full h-10 rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-dark-500 font-bold uppercase tracking-widest mb-1.5 block">Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message..."
                className="w-full h-32 rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white placeholder:text-dark-500 focus:border-gold-500/50 focus:outline-none resize-none" />
            </div>
            <button className="w-full h-10 rounded-lg bg-gold-500 text-dark-950 text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors flex items-center justify-center gap-2">
              <Send className="h-3.5 w-3.5" /> Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
