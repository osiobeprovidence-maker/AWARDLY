import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Star, Shield, Zap, Globe, Users, ArrowRight, CheckCircle2, ChevronRight, Menu, X } from 'lucide-react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { headiesBanner } from '../data';
import { PublicNav } from '../components/navigation/PublicNav';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-950 font-sans selection:bg-gold-500/30 selection:text-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-full bg-gold-500/[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-sky-500/[0.02] blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-8xl font-serif font-medium tracking-tight mb-8 leading-[1.1] text-white"
          >
            Celebrate Grandeur. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700 italic pr-4">Build Legacies.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-dark-300 max-w-2xl mb-12 leading-relaxed"
          >
            Awardly is the all-in-one platform for organizations to launch, manage, and monetize world-class awards. Create your own branded Award Hub, accept nominations, run secure voting, and celebrate excellence with confidence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Button size="lg" onClick={() => navigate('/auth/signup')} className="h-16 px-10 text-lg shadow-2xl shadow-gold-500/20">
              Start Your Hub Free
            </Button>
            <Button size="lg" variant="glass" onClick={() => navigate('/discover')} className="h-16 px-10 text-lg border-white/10">
              Explore Live Awards
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-24 w-full"
          >
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-500 mb-8">Built for Organizations That Celebrate Excellence</p>
             <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale pointer-events-none">
                <span className="text-2xl font-serif font-bold text-white tracking-widest">HEADIES</span>
                <span className="text-2xl font-serif font-bold text-white tracking-widest">OSCARS</span>
                <span className="text-2xl font-serif font-bold text-white tracking-widest">GRAMMYS</span>
                <span className="text-2xl font-serif font-bold text-white tracking-widest">NOBEL</span>
                <span className="text-2xl font-serif font-bold text-white tracking-widest">BAFTA</span>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-dark-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Built for Prestige at Scale</h2>
             <p className="text-dark-400 max-w-xl mx-auto">Everything you need to plan, manage, and grow a professional awards program, from nominations and judging to secure voting, audience engagement, and winner announcements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: 'Intelligent Categories', desc: 'Design award categories, eligibility rules, nominee requirements, and judging criteria through an intuitive management dashboard.' },
              { icon: Shield, title: 'Anti-Fraud Voting', desc: 'Protect every vote using fraud detection, phone verification, payment integration, and real-time monitoring.' },
              { icon: Zap, title: 'Real-time Analytics', desc: 'Track voting activity, audience engagement, and event performance through powerful real-time insights.' },
              { icon: Users, title: 'Audience CRM', desc: 'Build lasting relationships with nominees, voters, sponsors, and supporters from one centralized platform.' },
              { icon: Globe, title: 'Full Customization', desc: 'Launch a fully branded Award Hub that reflects your organization\'s identity, colors, and experience.' },
              { icon: Star, title: 'Monetization Suite', desc: 'Generate sustainable revenue through paid voting, premium nominations, sponsorships, advertising, and partnerships.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group"
              >
                <div className="h-12 w-12 bg-dark-800 rounded-xl flex items-center justify-center mb-6 text-gold-500 group-hover:bg-gold-500 group-hover:text-dark-950 transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="py-16 md:py-24 px-6 bg-gold-500/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">12M+</h4>
               <p className="text-[10px] font-bold text-white uppercase tracking-widest">Votes Processed Securely</p>
           </div>
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">450+</h4>
               <p className="text-[10px] font-bold text-white uppercase tracking-widest">Award Events Hosted</p>
           </div>
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">2k+</h4>
               <p className="text-[10px] font-bold text-white uppercase tracking-widest">Award Hubs Created</p>
           </div>
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">$4M</h4>
               <p className="text-[10px] font-bold text-white uppercase tracking-widest">Revenue Generated for Organizers</p>
           </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
             <div>
                <h2 className="text-4xl font-serif text-white mb-8">From Concept to Ceremony in Minutes</h2>
                <div className="space-y-12">
                   {[
                     { step: '01', title: 'Onboard Your Organization', desc: 'Create your Award Hub, upload your branding, and configure your organization.' },
                     { step: '02', title: 'Build Your Awards', desc: 'Create categories, accept nominations, configure judges, and define your voting rules.' },
                     { step: '03', title: 'Launch & Celebrate', desc: 'Open nominations or voting, engage your audience, announce winners, and celebrate excellence.' },
                   ].map((item, i) => (
                     <div key={i} className="flex gap-6 group">
                        <span className="text-3xl font-serif text-gold-500/20 group-hover:text-gold-500 transition-colors">{item.step}</span>
                        <div>
                           <h4 className="text-xl font-medium text-white mb-2">{item.title}</h4>
                           <p className="text-dark-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <Button onClick={() => navigate('/auth/signup')} className="mt-12 h-14 px-8">
                  Get Started Now <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
             </div>
             <div className="relative">
                <div className="aspect-square bg-gold-400/10 rounded-full blur-[100px] absolute inset-0 -z-10" />
                <div className="rounded-3xl border border-white/10 bg-dark-900 shadow-2xl overflow-hidden p-2 transform rotate-3">
                   <img 
                    src={headiesBanner} 
                    alt="Platform Preview" 
                    className="w-full h-auto rounded-2xl opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                   />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 border-t border-white/5">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">Ready to define excellence?</h2>
             <p className="text-dark-400 text-lg mb-12">Create a professional Award Hub in minutes and deliver unforgettable award experiences for your community.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button onClick={() => navigate('/auth/signup')} size="lg" className="h-16 px-12 text-lg">Create Your Hub</Button>
               <Button onClick={() => navigate('/discover')} size="lg" variant="outline" className="h-16 px-12 text-lg">Browse Award Directory</Button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center mb-6">
                <BrandLogo />
              </Link>
              <p className="text-dark-400 text-sm leading-relaxed mb-6">
                The world's leading platform for award management, secure voting, and community recognition.
              </p>
              <div className="flex gap-4">
                {['twitter', 'instagram', 'linkedin'].map((s) => (
                  <div key={s} className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-gold-500/20 hover:text-gold-400 cursor-pointer transition-colors text-dark-500">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{s[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: 'Platform', links: ['Discover', 'Features', 'Monetization', 'Security', 'API'] },
              { title: 'Resources', links: ['Documentation', 'Best Practices', 'Case Studies', 'Media Kit', 'Support'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Brand Portal', 'Privacy', 'Legal'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">{section.title}</h4>
                <div className="flex flex-col gap-4">
                  {section.links.map((link) => (
                    <Link key={link} to="#" className="text-sm text-dark-400 hover:text-gold-400 transition-colors">{link}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-dark-500 text-xs">© 2026 AWARDLY Excellence Platform. All rights reserved.</p>
            <div className="flex gap-8 text-xs font-bold text-dark-500 uppercase tracking-widest">
               <Link to="#" className="hover:text-white">Terms of Use</Link>
               <Link to="#" className="hover:text-white">Privacy Policy</Link>
               <Link to="#" className="hover:text-white">Global Compliance</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

