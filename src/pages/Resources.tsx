import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Globe, BookOpen, MessageSquare, PlayCircle, Star, Trophy, Users, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { PublicNav } from '../components/navigation/PublicNav';

const resources = [
  { 
    title: 'Hub Management Guide', 
    desc: 'Learn how to set up your award hub, customize branding, and manage permissions.',
    icon: BookOpen,
    category: 'Documentation'
  },
  { 
    title: 'Voting Best Practices', 
    desc: 'Strategies for maximizing voter turnout and engagement for your awards.',
    icon: Star,
    category: 'Growth'
  },
  { 
    title: 'Monetization Blueprint', 
    desc: 'A comprehensive guide to setting up paid voting and sponsor packages.',
    icon: Trophy,
    category: 'Business'
  },
  { 
    title: 'Community Engagement', 
    desc: 'Tips for using the social feed and broadcasts to keep your audience active.',
    icon: Users,
    category: 'Social'
  },
];

export function Resources() {
  return (
    <div className="min-h-screen bg-dark-950">
      <PublicNav />

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-white mb-6">Learning Center</h1>
            <p className="text-dark-400 text-lg">Everything you need to master AWARDLY and build world-class ceremonies.</p>
          </div>
          <Button variant="outline" className="h-12 border-white/10">Browse All Docs</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {resources.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full hover:border-gold-500/30 transition-all cursor-pointer group">
                <CardHeader>
                  <item.icon className="h-8 w-8 text-gold-500 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-2 block">{item.category}</span>
                  <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark-400 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-serif text-white mb-8">Featured Case Studies</h2>
              <div className="space-y-6">
                 {[1, 2].map((i) => (
                   <Card key={i} className="p-0 overflow-hidden group border-white/5 hover:border-gold-500/20 transition-all">
                      <div className="flex flex-col md:flex-row">
                         <div className="md:w-1/3 aspect-video md:aspect-auto bg-dark-800">
                            <img 
                              src={`https://images.unsplash.com/photo-1514525253361-b83f859b73c0?auto=format&fit=crop&q=80&w=400&h=300`} 
                              className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" 
                              alt="Case study" 
                              referrerPolicy="no-referrer"
                            />
                         </div>
                         <div className="p-8 flex-1">
                            <h3 className="text-xl text-white font-serif mb-4">The Global Music Awards: Reaching 5M Voters</h3>
                            <p className="text-dark-400 text-sm mb-6 leading-relaxed">Discover how GMA used AWARDLY's paid voting campaigns to generate $500k in revenue while maintaining transparency.</p>
                            <Button variant="ghost" className="p-0 text-gold-500 hover:text-gold-400 text-xs font-bold uppercase tracking-widest">
                               Read Case Study →
                            </Button>
                         </div>
                      </div>
                   </Card>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <h2 className="text-2xl font-serif text-white mb-8">Video Tutorials</h2>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                   <div className="h-20 w-32 bg-dark-800 rounded-lg flex items-center justify-center relative flex-shrink-0 group-hover:bg-dark-700 transition-colors border border-white/5">
                      <PlayCircle className="h-8 w-8 text-gold-500" />
                   </div>
                   <div>
                      <h4 className="text-white text-sm font-medium mb-1 line-clamp-2 leading-snug group-hover:text-gold-400 transition-colors">How to handle complex category weighting</h4>
                      <p className="text-dark-500 text-[10px] uppercase tracking-widest font-bold">4:25 duration</p>
                   </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">View Channel</Button>
           </div>
        </div>

        <section className="mt-32 p-12 rounded-3xl bg-dark-900 border border-white/10 text-center">
            <MessageSquare className="h-12 w-12 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl font-serif text-white mb-6">Need more help?</h2>
            <p className="text-dark-400 mb-8 max-w-xl mx-auto">Our support team is available 24/7 for organization managers. Visit our community forums or join our discord.</p>
            <div className="flex gap-4 justify-center">
               <Button variant="primary" className="h-12 px-8">Contact Support</Button>
               <Button variant="ghost" className="h-12 px-8">Join Discord</Button>
            </div>
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
