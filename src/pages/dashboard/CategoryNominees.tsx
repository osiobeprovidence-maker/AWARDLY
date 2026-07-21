import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Plus, Search, Trash2, Edit3, CheckCircle2, ShieldAlert, BarChart3, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ImageUpload } from '../../components/ImageUpload';
import { mockCategories, mockNominees } from '../../data';

export function CategoryNominees() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = mockCategories.find(c => c.id === categoryId) || mockCategories[0];
  const nominees = mockNominees.filter(n => n.categoryId === categoryId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <Users className="h-4 w-4 text-gold-500" />
               <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Management Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">{category.name} <span className="text-dark-500 not-italic">/ Nominees</span></h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <BarChart3 className="h-4 w-4 mr-2" /> Stats
          </Button>
          <Button className="shadow-lg shadow-gold-500/20">
            <Plus className="h-4 w-4 mr-2" /> Add New Nominee
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Add Sidebar */}
        <div className="space-y-6">
           <Card className="border-gold-500/20 bg-gold-500/5">
              <CardHeader>
                <CardTitle className="text-lg">Rapid Add</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <ImageUpload 
                   label="Profile Photo"
                   aspectRatio="square"
                   onImageSelect={(file) => console.log(file)}
                 />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Nominee Name</label>
                    <Input placeholder="e.g. Wizkid" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Short Bio</label>
                    <textarea 
                      className="w-full min-h-[100px] bg-dark-900 border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:ring-1 focus:ring-gold-500/50"
                      placeholder="Briefly describe why they are nominated..."
                    />
                 </div>
                 <Button className="w-full h-12">Confirm Nominee</Button>
              </CardContent>
           </Card>

           <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                 <ShieldAlert className="h-4 w-4 text-dark-400" />
                 <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">Verification Status</span>
              </div>
              <p className="text-xs text-dark-500 leading-relaxed">Ensure all nominees are verified against platform requirements to maintain voting integrity.</p>
           </div>
        </div>

        {/* Nominee List */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
                <Input placeholder="Search nominees..." className="pl-10" />
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="text-dark-500"><Filter className="h-4 w-4" /></Button>
                 <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">{nominees.length} Registered</span>
              </div>
           </div>

           <div className="grid gap-4">
              {nominees.map((nominee, i) => (
                <motion.div
                  key={nominee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-dark-900/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-gold-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl overflow-hidden border border-white/10 relative">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nominee.name}`} 
                        className="w-full h-full object-cover" 
                        alt={nominee.name} 
                      />
                      {i === 0 && (
                        <div className="absolute top-1 right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-dark-900 flex items-center justify-center">
                          <CheckCircle2 className="h-2 w-2 text-dark-950" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{nominee.name}</h3>
                      <p className="text-[10px] text-dark-500 uppercase tracking-widest mt-1">Verified Candidate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="glass" size="icon" className="h-10 w-10"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="glass" size="icon" className="h-10 w-10 text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </motion.div>
              ))}
           </div>

           <Button variant="outline" className="w-full h-14 border-dashed border-2 bg-white/0 hover:bg-white/5 border-white/10 text-dark-400">
              <Plus className="h-4 w-4 mr-2" /> Bulk Import Nominees (CSV)
           </Button>
        </div>
      </div>
    </div>
  );
}
