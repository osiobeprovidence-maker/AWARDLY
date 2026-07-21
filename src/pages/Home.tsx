import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { Trophy, Star, Shield, Zap, Globe, Users, ArrowRight, CheckCircle2, ChevronRight, Menu, X } from 'lucide-react';
import { BrandLogo } from '../components/brand/BrandLogo';

export function Home() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-dark-950 font-sans selection:bg-gold-500/30 selection:text-white">
      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center group">
            <BrandLogo />
          </Link>
          <div className="hidden lg:flex gap-8">
            <Link to="/discover" className="text-dark-300 hover:text-white font-medium transition-colors">Explore</Link>
            <a href="#features" className="text-dark-300 hover:text-white font-medium transition-colors">Features</a>
            <Link to="/pricing" className="text-dark-300 hover:text-white font-medium transition-colors">Pricing</Link>
            <Link to="/resources" className="text-dark-300 hover:text-white font-medium transition-colors">Resources</Link>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/auth/login')} className="text-dark-300 hover:text-white">
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth/signup')} className="shadow-lg shadow-gold-500/10">
            Create Hub
          </Button>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-dark-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] lg:hidden bg-dark-950/98 backdrop-blur-2xl"
          >
            <div className="flex flex-col h-full p-12">
               <div className="flex justify-between items-center mb-24">
                  <BrandLogo />
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
               </div>
               
               <nav className="flex flex-col gap-12">
                  {[
                    { label: 'Explore Hubs', to: '/discover' },
                    { label: 'Features', to: '#features' },
                    { label: 'Pricing', to: '/pricing' },
                    { label: 'Resources', to: '/resources' },
                  ].map((item) => (
                    <Link 
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-5xl font-serif text-white italic tracking-tighter"
                    >
                      {item.label}
                    </Link>
                  ))}
               </nav>

               <div className="mt-auto pt-12 border-t border-white/5 flex flex-col gap-4">
                  <Button onClick={() => navigate('/auth/login')} variant="outline" className="h-16 text-lg">Sign In</Button>
                  <Button onClick={() => navigate('/auth/signup')} className="h-16 text-lg">Get Started Free</Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            AWARDLY is the premiere multi-tenant platform for prestigious organizations to host high-stakes awards, manage secure voting, and broadcast excellence to millions.
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
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-dark-500 mb-8">Trusted by Elite Organizations</p>
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
             <p className="text-dark-400 max-w-xl mx-auto">Everything you need to run professional ceremonies, from category definition to multi-channel voting.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: 'Intelligent Categories', desc: 'Define complex award structures, nominee lists, and eligibility rules with a sleek dashboard.' },
              { icon: Shield, title: 'Anti-Fraud Voting', desc: 'Secure voting engine with phone verification, payment gateway integration, and real-time auditing.' },
              { icon: Zap, title: 'Real-time Analytics', desc: 'Watch the leaderboard evolve in real-time. Gain deep insights into your audience engagement.' },
              { icon: Users, title: 'Audience CRM', desc: 'Own your audience data. Communicate with followers and build a community around your brand.' },
              { icon: Globe, title: 'Full Customization', desc: 'Your brand, your rules. Customize every aspect of your public-facing award hub.' },
              { icon: Star, title: 'Monetization Suite', desc: 'Generate revenue through paid voting packages, sponsored categories, and ads.' },
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
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Votes Processed</p>
           </div>
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">450+</h4>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Events Hosted</p>
           </div>
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">2k+</h4>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Award Hubs</p>
           </div>
           <div>
              <h4 className="text-3xl md:text-6xl font-serif text-gold-400 mb-2">$4M</h4>
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Monetized for Hubs</p>
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
                     { step: '01', title: 'Onboard Organization', desc: 'Create your hub, upload your branding, and define your mission.' },
                     { step: '02', title: 'Configure Awards', desc: 'Set up categories, nominees, and voting rules for your specific needs.' },
                     { step: '03', title: 'Engage & Broadcast', desc: 'Launch your hub publically, open voting, and post community updates.' },
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
                    src="/src/assets/images/headies_banner_crowd_1784644528540.jpg" 
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
            <p className="text-dark-400 text-lg mb-12">Join thousands of organizations building world-class award experiences for their communities.</p>
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
                The global infrastructure for award management and community excellence.
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

