import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { CheckCircle2, Globe, ArrowRight, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';

const tiers = [
  {
    name: 'Foundation',
    price: 'Free',
    description: 'Perfect for small communities and local events.',
    features: [
      '1 Active Award Event',
      'Up to 1,000 Votes',
      'Basic Social Feed',
      'Standard Support',
      'Public Directory Listing',
    ],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Prestige',
    price: '₦150,000',
    period: '/month',
    description: 'Advanced features for growing professional organizations.',
    features: [
      'Unlimited Award Events',
      'Up to 50,000 Votes',
      'Paid Voting Campaigns',
      'Advanced Analytics',
      'Sponsor Management',
      'Priority Support',
    ],
    cta: 'Start 14-Day Trial',
    popular: true,
  },
  {
    name: 'Elite',
    price: 'Custom',
    description: 'Bespoke infrastructure for global scale ceremonies.',
    features: [
      'Unlimited Everything',
      'White-label Domains',
      'API Access',
      'Dedicated Account Manager',
      'Fraud Prevention Audit',
      'Live Stream Integration',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-dark-950">
      <nav className="h-20 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl text-white">
        <Link to="/" className="flex items-center">
          <BrandLogo />
        </Link>
        <div className="hidden md:flex gap-8">
           <Link to="/discover" className="text-dark-300 hover:text-white transition-colors">Discover</Link>
           <Link to="/pricing" className="text-white font-medium">Pricing</Link>
           <Link to="/resources" className="text-dark-300 hover:text-white transition-colors">Resources</Link>
        </div>
        <div className="flex gap-4">
           <Link to="/auth/login" className="hidden sm:block"><Button variant="ghost">Login</Button></Link>
           <Link to="/auth/signup" className="hidden sm:block"><Button>Get Started</Button></Link>
           
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white"
           >
             {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
           </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-dark-950/95 backdrop-blur-xl pt-24 px-6">
              <div className="flex flex-col gap-6">
                {['Discover', 'Pricing', 'Resources'].map((item) => (
                  <Link 
                    key={item} 
                    to={item === 'Discover' ? '/discover' : item === 'Pricing' ? '/pricing' : '/resources'} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-serif text-white italic tracking-tight"
                  >
                    {item}
                  </Link>
                ))}
                <div className="h-px w-full bg-white/5 my-4" />
                <Link to="/auth/login" className="text-lg font-bold uppercase tracking-widest text-gold-500">Log In</Link>
                <Link to="/auth/signup" className="text-lg font-bold uppercase tracking-widest text-white">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-24">
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-3xl sm:text-4xl md:text-6xl font-serif text-white mb-6"
           >
             Simple, Transparent Pricing
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-dark-400 text-lg max-w-2xl mx-auto"
           >
             Choose the plan that fits your organization's level of excellence. No hidden fees.
           </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {tiers.map((tier, i) => (
             <motion.div
               key={tier.name}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 + 0.2 }}
             >
               <Card className={`relative h-full flex flex-col ${tier.popular ? 'border-gold-500/50 shadow-2xl shadow-gold-500/10' : 'border-white/5'}`}>
                 {tier.popular && (
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-dark-950 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                     Most Popular
                   </div>
                 )}
                 <CardHeader className="text-center p-8">
                   <CardTitle className="text-xl font-serif text-white mb-2">{tier.name}</CardTitle>
                   <div className="flex items-baseline justify-center gap-1 mb-4">
                     <span className="text-4xl font-bold text-white">{tier.price}</span>
                     {tier.period && <span className="text-dark-500 text-sm">{tier.period}</span>}
                   </div>
                   <CardDescription className="text-sm">
                     {tier.description}
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="flex-1 p-8 pt-0 flex flex-col">
                   <div className="space-y-4 mb-12">
                     {tier.features.map((feature) => (
                       <div key={feature} className="flex items-start gap-3">
                         <CheckCircle2 className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
                         <span className="text-sm text-dark-300">{feature}</span>
                       </div>
                     ))}
                   </div>
                    <Button
                     variant={tier.popular ? 'primary' : 'outline'}
                     className="w-full h-12 mt-auto"
                     onClick={() => navigate('/auth/signup')}
                    >
                     {tier.cta}
                   </Button>
                 </CardContent>
               </Card>
             </motion.div>
           ))}
        </div>

        {/* FAQ Preview */}
        <div className="mt-32 max-w-3xl mx-auto">
           <h2 className="text-3xl font-serif text-white mb-12 text-center">Frequently Asked Questions</h2>
           <div className="space-y-8">
              {[
                { q: 'Can I change plans at any time?', a: 'Yes, you can upgrade or downgrade your plan directly from your organization settings.' },
                { q: 'How does paid voting work?', a: 'Organizations can set prices for vote packages. AWARDLY processes payments and settles funds to your connected account.' },
                { q: 'Is there a limit on how many nominees I can have?', a: 'Nominee limits vary by plan. The Prestige and Elite plans support unlimited nominees per category.' },
              ].map((faq, i) => (
                <div key={i} className="border-b border-white/5 pb-8">
                   <h4 className="text-white font-medium mb-3">{faq.q}</h4>
                   <p className="text-sm text-dark-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>

        <section className="mt-32 p-12 rounded-3xl bg-gold-500/10 border border-gold-500/20 text-center">
           <h2 className="text-3xl font-serif text-white mb-6">Need a custom solution?</h2>
           <p className="text-dark-400 mb-8 max-w-xl mx-auto">We offer enterprise-grade SLA, custom on-site support, and white-labeling for large scale award programs.</p>
           <Button variant="glass" className="h-14 px-10">Speak with our Elite Team <ArrowRight className="h-4 w-4 ml-2" /></Button>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-dark-950 py-12 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <BrandLogo />
            </div>
            <p className="text-xs text-dark-500">© 2026 AWARDLY Excellence Platform.</p>
         </div>
      </footer>
    </div>
  );
}
