import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  DollarSign, 
  Plus, 
  Package, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  X, 
  Save, 
  Copy, 
  Search, 
  CreditCard, 
  Settings2, 
  AlertCircle,
  Bell,
  MoreVertical,
  Check,
  ChevronRight,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';

interface VotingPackage {
  id: string;
  name: string;
  price: number;
  votes: number;
  description: string;
  color: string;
  popular: boolean;
  active: boolean;
  expiry: string;
  maxPurchases?: number;
}

interface GatewayConfig {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  publicKey: string;
  secretKey: string;
  webhookUrl: string;
  settlementAccount: string;
  testMode: boolean;
}

interface RevenueSettings {
  commission: number;
  feeHandling: 'platform' | 'voter';
  settlementSchedule: 'daily' | 'weekly' | 'monthly' | 'after_event';
  minWithdrawal: number;
  autoPayout: boolean;
  multiCurrency: boolean;
  taxInclusive: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function Monetization() {
  // --- State ---
  const [packages, setPackages] = React.useState<VotingPackage[]>([
    { 
      id: '1', 
      name: 'Fan Starter', 
      price: 2500, 
      votes: 10, 
      description: 'Ideal for casual fans to show initial support.', 
      color: '#d4a352',
      popular: false, 
      active: true,
      expiry: 'No Expiry'
    },
    { 
      id: '2', 
      name: 'Mega Supporter', 
      price: 10000, 
      votes: 50, 
      description: 'The most popular choice for active community members.', 
      color: '#ead8b0',
      popular: true, 
      active: true,
      expiry: 'No Expiry'
    },
    { 
      id: '3', 
      name: 'Elite Bundle', 
      price: 50000, 
      votes: 300, 
      description: 'Maximum impact for dedicated super fans and sponsors.', 
      color: '#714324',
      popular: false, 
      active: true,
      expiry: 'No Expiry'
    },
  ]);

  const [gateways, setGateways] = React.useState<GatewayConfig[]>([
    {
      id: 'paystack',
      name: 'Paystack',
      icon: 'PS',
      connected: true,
      publicKey: 'pk_live_************************',
      secretKey: 'sk_live_************************',
      webhookUrl: 'https://api.awardly.com/webhooks/paystack',
      settlementAccount: 'Access Bank - 0123456789',
      testMode: false
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: 'FW',
      connected: false,
      publicKey: '',
      secretKey: '',
      webhookUrl: 'https://api.awardly.com/webhooks/flutterwave',
      settlementAccount: '',
      testMode: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: 'ST',
      connected: false,
      publicKey: '',
      secretKey: '',
      webhookUrl: 'https://api.awardly.com/webhooks/stripe',
      settlementAccount: '',
      testMode: true
    }
  ]);

  const [settings, setSettings] = React.useState<RevenueSettings>({
    commission: 5.0,
    feeHandling: 'voter',
    settlementSchedule: 'weekly',
    minWithdrawal: 10000,
    autoPayout: true,
    multiCurrency: true,
    taxInclusive: true
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [isPkgModalOpen, setIsPkgModalOpen] = React.useState(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [packageToDelete, setPackageToDelete] = React.useState<string | null>(null);
  const [editingPackageId, setEditingPackageId] = React.useState<string | null>(null);
  const [selectedGatewayId, setSelectedGatewayId] = React.useState<string | null>(null);
  
  const [pkgForm, setPkgForm] = React.useState<Partial<VotingPackage>>({
    name: '',
    price: 0,
    votes: 0,
    description: '',
    color: '#d4a352',
    popular: false,
    active: true,
    expiry: 'No Expiry'
  });

  const [gatewayForm, setGatewayForm] = React.useState<Partial<GatewayConfig>>({});

  // --- Derived Stats ---
  const totalRevenue = React.useMemo(() => packages.reduce((acc, p) => acc + (p.active ? p.price * 150 : 0), 0), [packages]);
  const activePackageCount = packages.filter(p => p.active).length;
  const avgPrice = packages.length > 0 ? packages.reduce((acc, p) => acc + p.price, 0) / packages.length : 0;
  const simulatedConversion = React.useMemo(() => (Math.random() * (0.08 - 0.02) + 0.02).toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 1}), []);

  // --- Handlers ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleSavePackage = () => {
    if (!pkgForm.name || !pkgForm.price || !pkgForm.votes) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (editingPackageId) {
      setPackages(packages.map(p => p.id === editingPackageId ? { ...p, ...pkgForm } as VotingPackage : p));
      addToast('Package updated successfully');
    } else {
      const newPkg: VotingPackage = {
        ...(pkgForm as VotingPackage),
        id: Math.random().toString(36).substr(2, 9),
      };
      setPackages([...packages, newPkg]);
      addToast('Package created successfully');
    }

    setIsPkgModalOpen(false);
    setEditingPackageId(null);
  };

  const handleDuplicatePackage = (pkg: VotingPackage) => {
    const duplicated: VotingPackage = {
      ...pkg,
      id: Math.random().toString(36).substr(2, 9),
      name: `${pkg.name} (Copy)`,
      active: false
    };
    setPackages([...packages, duplicated]);
    addToast('Package duplicated');
  };

  const handleTogglePackage = (id: string) => {
    setPackages(packages.map(p => {
      if (p.id === id) {
        const newState = !p.active;
        addToast(newState ? 'Package enabled' : 'Package disabled');
        return { ...p, active: newState };
      }
      return p;
    }));
  };

  const confirmDelete = (id: string) => {
    setPackageToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = () => {
    if (packageToDelete) {
      setPackages(packages.filter(p => p.id !== packageToDelete));
      addToast('Package deleted');
      setIsDeleteConfirmOpen(false);
      setPackageToDelete(null);
    }
  };

  const handleGatewayConfig = (gateway: GatewayConfig) => {
    setSelectedGatewayId(gateway.id);
    setGatewayForm(gateway);
    setIsGatewayModalOpen(true);
  };

  const handleSaveGateway = () => {
    setGateways(gateways.map(g => g.id === selectedGatewayId ? { ...g, ...gatewayForm } as GatewayConfig : g));
    addToast('Gateway configuration saved');
    setIsGatewayModalOpen(false);
  };

  const handleToggleGateway = (id: string) => {
    setGateways(gateways.map(g => {
      if (g.id === id) {
        const newState = !g.connected;
        addToast(newState ? `${g.name} connected` : `${g.name} disconnected`);
        return { ...g, connected: newState };
      }
      return g;
    }));
  };

  const handleSaveSettings = () => {
    addToast('Revenue settings updated successfully');
  };

  const filteredPackages = packages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 relative">
      {/* Breadcrumbs */}
      <Breadcrumbs />
      <div className="fixed top-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl pointer-events-auto ${
                toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20">
              <DollarSign className="h-6 w-6 text-gold-500" />
            </div>
            <h1 className="text-3xl font-serif text-white tracking-tight">Monetization & Packages</h1>
          </div>
          <p className="text-dark-400">Professional revenue tools for high-impact award events.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
            <Input 
              placeholder="Filter packages..." 
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-11 px-6 shadow-lg shadow-gold-500/20" onClick={() => {
            setEditingPackageId(null);
            setPkgForm({
              name: '', price: 0, votes: 0, description: '', color: '#d4a352', popular: false, active: true, expiry: 'No Expiry'
            });
            setIsPkgModalOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" /> Create Package
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Estimated Revenue', value: `₦${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-gold-400', bg: 'bg-gold-500/5', border: 'border-gold-500/20' },
          { label: 'Active Packages', value: activePackageCount, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
          { label: 'Avg. Package Price', value: `₦${avgPrice.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' },
          { label: 'Conversion Rate', value: simulatedConversion, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`${stat.bg} ${stat.border}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.border}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-dark-500">Live</span>
                </div>
                <p className="text-dark-400 text-[10px] uppercase tracking-widest mb-1 font-bold">{stat.label}</p>
                <h3 className={`text-2xl font-serif ${stat.color}`}>{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/5 bg-dark-900/40">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div>
                <CardTitle className="text-xl">Voting Bundles</CardTitle>
                <CardDescription>Configure the commercial voting options available to the public.</CardDescription>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-dark-500 bg-white/5 px-3 py-1 rounded-full">
                {filteredPackages.length} Bundles found
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="popLayout">
                {filteredPackages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center flex flex-col items-center"
                  >
                    <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5 shadow-inner">
                      <Package className="h-10 w-10 text-dark-700" />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-2">No voting packages created yet.</h3>
                    <p className="text-dark-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">Voting bundles are necessary for fans to support their favorite nominees commercially.</p>
                    <Button onClick={() => setIsPkgModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Design First Bundle
                    </Button>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPackages.map((pkg) => (
                      <motion.div 
                        layout
                        key={pkg.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative group rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden ${
                          pkg.active 
                            ? 'bg-dark-900 border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50' 
                            : 'bg-dark-950/40 border-white/5 opacity-60'
                        }`}
                      >
                        {/* Dynamic Background Accent */}
                        <div 
                          className="absolute -top-12 -right-12 w-32 h-32 blur-[64px] opacity-10 transition-opacity group-hover:opacity-20"
                          style={{ backgroundColor: pkg.color }}
                        />

                        <div>
                          <div className="flex items-start justify-between mb-6">
                            <div className="h-12 w-12 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg" style={{ backgroundColor: `${pkg.color}20`, color: pkg.color }}>
                              <Package className="h-6 w-6" />
                            </div>
                            <div className="flex items-center gap-1.5">
                              {pkg.popular && (
                                <span className="text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 bg-gold-500 text-dark-950 rounded-full shadow-lg shadow-gold-500/20">
                                  Popular
                                </span>
                              )}
                              <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${pkg.active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-dark-500'}`}>
                                {pkg.active ? 'Active' : 'Draft'}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-xl font-serif text-white mb-2 leading-tight">{pkg.name}</h4>
                          <p className="text-xs text-dark-400 line-clamp-2 mb-6 h-8">{pkg.description}</p>
                          
                          <div className="flex items-baseline gap-2 mb-2">
                             <span className="text-3xl font-serif text-white">₦{pkg.price.toLocaleString()}</span>
                             <span className="text-xs text-dark-500 uppercase tracking-widest font-bold">/ bundle</span>
                          </div>
                          <div className="flex items-center gap-2 mb-8">
                            <div className="h-1 w-1 rounded-full bg-gold-500" />
                            <span className="text-xs font-medium text-gold-500/80">{pkg.votes} Voting Credits</span>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                          <div className="flex gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white"
                              onClick={() => {
                                setEditingPackageId(pkg.id);
                                setPkgForm(pkg);
                                setIsPkgModalOpen(true);
                              }}
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white"
                              onClick={() => handleDuplicatePackage(pkg)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-xl hover:bg-rose-500/10 text-dark-400 hover:text-rose-400"
                              onClick={() => confirmDelete(pkg.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-9 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] ${pkg.active ? 'text-dark-500' : 'text-emerald-500'}`}
                            onClick={() => handleTogglePackage(pkg.id)}
                          >
                            {pkg.active ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-6">
          {/* Gateways */}
          <Card className="bg-dark-900 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Payment Gateways</CardTitle>
                <CardDescription>Payout and processing channels.</CardDescription>
              </div>
              <CreditCard className="h-5 w-5 text-dark-500" />
            </CardHeader>
            <CardContent className="space-y-3">
               {gateways.map((gateway) => (
                 <div 
                   key={gateway.id}
                   className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                     gateway.connected 
                       ? 'bg-white/5 border-white/10' 
                       : 'bg-white/[0.02] border-white/5 grayscale'
                   }`}
                 >
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 bg-dark-800 border border-white/5 rounded-xl flex items-center justify-center font-bold text-[10px] text-white">
                          {gateway.icon}
                       </div>
                       <div>
                          <h4 className="text-white font-medium text-sm">{gateway.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className={`h-1.5 w-1.5 rounded-full ${gateway.connected ? 'bg-emerald-500' : 'bg-dark-600'}`} />
                            <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">
                              {gateway.connected ? 'Connected' : 'Offline'}
                            </p>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        onClick={() => handleGatewayConfig(gateway)}
                      >
                        <Settings2 className="h-4 w-4 text-dark-500" />
                      </Button>
                      <Button 
                        variant={gateway.connected ? "ghost" : "outline"}
                        size="sm"
                        className={`h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                          gateway.connected ? 'text-rose-400 hover:bg-rose-500/10' : 'text-gold-500 border-gold-500/20'
                        }`}
                        onClick={() => handleToggleGateway(gateway.id)}
                      >
                        {gateway.connected ? 'Exit' : 'Add'}
                      </Button>
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>

          {/* Revenue & Payout Settings */}
          <Card className="bg-dark-900 border-white/10">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">Revenue & Payout Settings</CardTitle>
                  <CardDescription>Financial policies and automation.</CardDescription>
                </div>
                <Save className="h-5 w-5 text-dark-500" />
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Platform Commission</label>
                        <span className="text-xs text-white">{settings.commission}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 rounded-full" style={{ width: `${settings.commission * 10}%` }} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Fee Handling</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
                        <button 
                          onClick={() => setSettings({...settings, feeHandling: 'platform'})}
                          className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${settings.feeHandling === 'platform' ? 'bg-dark-800 text-white shadow-lg' : 'text-dark-500'}`}
                        >
                          Platform Pays
                        </button>
                        <button 
                          onClick={() => setSettings({...settings, feeHandling: 'voter'})}
                          className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${settings.feeHandling === 'voter' ? 'bg-dark-800 text-white shadow-lg' : 'text-dark-500'}`}
                        >
                          Pass to Voter
                        </button>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Settlement Schedule</label>
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                        value={settings.settlementSchedule}
                        onChange={(e) => setSettings({...settings, settlementSchedule: e.target.value as any})}
                      >
                        <option value="daily">Daily Settlements</option>
                        <option value="weekly">Weekly Settlements</option>
                        <option value="monthly">Monthly Settlements</option>
                        <option value="after_event">After Event Ends</option>
                      </select>
                   </div>

                   <div className="space-y-4 pt-2">
                      {[
                        { label: 'Automatic Payouts', key: 'autoPayout' },
                        { label: 'Multi-Currency Support', key: 'multiCurrency' },
                        { label: 'Tax Inclusive Pricing', key: 'taxInclusive' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <span className="text-xs text-dark-300">{item.label}</span>
                          <div 
                            className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${(settings as any)[item.key] ? 'bg-emerald-500' : 'bg-dark-700'}`}
                            onClick={() => setSettings({ ...settings, [item.key]: !(settings as any)[item.key] })}
                          >
                             <motion.div 
                               animate={{ x: (settings as any)[item.key] ? 18 : 2 }}
                               className="absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-md" 
                             />
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
                
                <Button className="w-full h-11 shadow-lg shadow-emerald-500/10 bg-dark-800 hover:bg-dark-700 border border-white/10" onClick={handleSaveSettings}>
                  Save Financial Policies
                </Button>
             </CardContent>
          </Card>

          <Card className="border-gold-500/20 bg-gold-500/[0.02]">
             <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20">
                  <ShieldCheck className="h-6 w-6 text-gold-500" />
                </div>
                <div>
                   <h4 className="text-white font-medium text-sm mb-1">Payment Security</h4>
                   <p className="text-xs text-dark-500 leading-relaxed">
                     All transactions are processed through level 1 PCI-compliant providers with 256-bit encryption.
                   </p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Package Modal */}
      <AnimatePresence>
        {isPkgModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPkgModalOpen(false)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-dark-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-dark-900/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gold-500/10 rounded-2xl flex items-center justify-center border border-gold-500/20">
                    <Package className="h-6 w-6 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-white">{editingPackageId ? 'Update Package' : 'Create New Bundle'}</h2>
                    <p className="text-xs text-dark-400">Configure your commercial voting package details.</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setIsPkgModalOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Package Branding</label>
                    <Input 
                      placeholder="e.g. Platinum Fan Pack" 
                      value={pkgForm.name}
                      onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Price (₦)</label>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={pkgForm.price || ''}
                        onChange={(e) => setPkgForm({ ...pkgForm, price: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Votes Included</label>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        value={pkgForm.votes || ''}
                        onChange={(e) => setPkgForm({ ...pkgForm, votes: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Short Description</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-dark-600 focus:outline-none focus:ring-2 focus:ring-gold-500/50 min-h-[100px]"
                      placeholder="What makes this bundle special?"
                      value={pkgForm.description}
                      onChange={(e) => setPkgForm({ ...pkgForm, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Visual Theme Color</label>
                    <div className="flex gap-2">
                      {['#d4a352', '#ead8b0', '#714324', '#3b82f6', '#10b981', '#f43f5e'].map(color => (
                        <button
                          key={color}
                          onClick={() => setPkgForm({...pkgForm, color})}
                          className={`h-8 w-8 rounded-full border-2 transition-all ${pkgForm.color === color ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Expiry Policy</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                      value={pkgForm.expiry}
                      onChange={(e) => setPkgForm({...pkgForm, expiry: e.target.value})}
                    >
                      <option value="No Expiry">No Expiry</option>
                      <option value="End of Category">End of Category</option>
                      <option value="End of Event">End of Event</option>
                      <option value="24 Hours">24 Hours from Purchase</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Purchase Limit (Optional)</label>
                    <Input 
                      type="number" 
                      placeholder="Unlimited" 
                      value={pkgForm.maxPurchases || ''}
                      onChange={(e) => setPkgForm({ ...pkgForm, maxPurchases: e.target.value ? Number(e.target.value) : undefined })}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`p-1.5 rounded-lg ${pkgForm.popular ? 'bg-gold-500/10 text-gold-500' : 'bg-dark-800 text-dark-500'}`}>
                           <Zap className="h-4 w-4" />
                         </div>
                         <span className="text-xs text-white font-medium">Popular Badge</span>
                      </div>
                      <div 
                        className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${pkgForm.popular ? 'bg-gold-500' : 'bg-dark-700'}`}
                        onClick={() => setPkgForm({ ...pkgForm, popular: !pkgForm.popular })}
                      >
                        <motion.div animate={{ x: pkgForm.popular ? 18 : 2 }} className="absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-md" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className={`p-1.5 rounded-lg ${pkgForm.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-dark-800 text-dark-500'}`}>
                           <Check className="h-4 w-4" />
                         </div>
                         <span className="text-xs text-white font-medium">Package Active</span>
                      </div>
                      <div 
                        className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${pkgForm.active ? 'bg-emerald-500' : 'bg-dark-700'}`}
                        onClick={() => setPkgForm({ ...pkgForm, active: !pkgForm.active })}
                      >
                        <motion.div animate={{ x: pkgForm.active ? 18 : 2 }} className="absolute top-0.5 h-4 w-4 bg-white rounded-full shadow-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
                <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsPkgModalOpen(false)}>
                  Discard Changes
                </Button>
                <Button className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-gold-500/20" onClick={handleSavePackage}>
                  <Save className="h-4 w-4 mr-2" /> {editingPackageId ? 'Update Bundle' : 'Finalize Package'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gateway Modal */}
      <AnimatePresence>
        {isGatewayModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGatewayModalOpen(false)}
              className="absolute inset-0 bg-dark-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-white">{gatewayForm.name} Integration</h2>
                  <p className="text-xs text-dark-400">Manage your secure API connection.</p>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => setIsGatewayModalOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Public Key</label>
                  <Input 
                    placeholder="pk_test_..." 
                    value={gatewayForm.publicKey}
                    onChange={(e) => setGatewayForm({...gatewayForm, publicKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Secret Key</label>
                  <Input 
                    type="password" 
                    placeholder="sk_test_..." 
                    value={gatewayForm.secretKey}
                    onChange={(e) => setGatewayForm({...gatewayForm, secretKey: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Webhook URL</label>
                  <div className="flex gap-2">
                    <Input value={gatewayForm.webhookUrl} readOnly className="bg-dark-800" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" onClick={() => {
                      navigator.clipboard.writeText(gatewayForm.webhookUrl!);
                      addToast('URL copied to clipboard', 'info');
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-dark-400">Settlement Account</label>
                  <Input 
                    placeholder="Account Name & Number" 
                    value={gatewayForm.settlementAccount}
                    onChange={(e) => setGatewayForm({...gatewayForm, settlementAccount: e.target.value})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gold-500/5 border border-gold-500/10">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-gold-500" />
                    <span className="text-xs text-gold-500 font-medium">Test Mode Enabled</span>
                  </div>
                  <div 
                    className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors ${gatewayForm.testMode ? 'bg-gold-500' : 'bg-dark-700'}`}
                    onClick={() => setGatewayForm({ ...gatewayForm, testMode: !gatewayForm.testMode })}
                  >
                    <motion.div animate={{ x: gatewayForm.testMode ? 18 : 2 }} className="absolute top-0.5 h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5 flex gap-4">
                <Button variant="ghost" className="flex-1" onClick={() => setIsGatewayModalOpen(false)}>Cancel</Button>
                <Button className="flex-1 shadow-lg shadow-gold-500/10" onClick={handleSaveGateway}>Deploy Config</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-dark-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-dark-900 border border-white/10 rounded-[32px] p-8 text-center"
            >
              <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                <Trash2 className="h-8 w-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">Delete this bundle?</h3>
              <p className="text-dark-500 text-sm mb-8 leading-relaxed">This will permanently remove the package and prevent future sales. Historical data will be preserved.</p>
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 border-rose-600 text-white" onClick={handleDelete}>
                  Yes, Delete Package
                </Button>
                <Button variant="ghost" className="w-full h-11 rounded-xl text-dark-400" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Keep Package
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
