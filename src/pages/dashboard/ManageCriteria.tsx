import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Plus, GripVertical, Pencil, Trash2, Save, RotateCcw,
  AlertTriangle, CheckCircle2, Weight, X, Award
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useToast } from '../../lib/toast';

interface Criterion {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  description: string;
}

const DEFAULT_CRITERIA: Criterion[] = [
  { id: '1', name: 'Innovation', weight: 25, maxScore: 10, description: 'Novelty and creativity of the work' },
  { id: '2', name: 'Popularity', weight: 20, maxScore: 10, description: 'Public reception and audience engagement' },
  { id: '3', name: 'Performance', weight: 20, maxScore: 10, description: 'Quality of live/recorded performances' },
  { id: '4', name: 'Originality', weight: 20, maxScore: 10, description: 'Authenticity and unique artistic voice' },
  { id: '5', name: 'Impact', weight: 15, maxScore: 10, description: 'Cultural influence and industry significance' },
];

export function ManageCriteria() {
  const { eventId, categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [criteria, setCriteria] = React.useState<Criterion[]>(DEFAULT_CRITERIA);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

  const [formName, setFormName] = React.useState('');
  const [formWeight, setFormWeight] = React.useState(20);
  const [formMaxScore, setFormMaxScore] = React.useState(10);
  const [formDescription, setFormDescription] = React.useState('');
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});

  const totalWeight = React.useMemo(() => criteria.reduce((sum, c) => sum + c.weight, 0), [criteria]);
  const isBalanced = totalWeight === 100;

  const getWeightColor = (weight: number) => {
    if (weight >= 30) return 'border-gold-500/50 bg-gold-500/5';
    if (weight >= 20) return 'border-gold-500/20 bg-gold-500/[0.02]';
    return 'border-white/5 bg-white/[0.01]';
  };

  const getBarColor = (weight: number) => {
    if (weight >= 30) return 'bg-gold-500 shadow-[0_0_12px_rgba(198,138,53,0.3)]';
    if (weight >= 20) return 'bg-gold-500/70';
    return 'bg-dark-600';
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormWeight(20);
    setFormMaxScore(10);
    setFormDescription('');
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (c: Criterion) => {
    setEditingId(c.id);
    setFormName(c.name);
    setFormWeight(c.weight);
    setFormMaxScore(c.maxScore);
    setFormDescription(c.description);
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = 'Name is required';
    if (formWeight <= 0) errors.weight = 'Weight must be greater than 0';
    if (formMaxScore <= 0) errors.maxScore = 'Max score must be greater than 0';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveModal = () => {
    if (!validate()) return;

    if (editingId) {
      setCriteria((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? { ...c, name: formName.trim(), weight: formWeight, maxScore: formMaxScore, description: formDescription.trim() }
            : c
        )
      );
      toast('Criterion updated', 'success');
    } else {
      const newCriterion: Criterion = {
        id: Date.now().toString(),
        name: formName.trim(),
        weight: formWeight,
        maxScore: formMaxScore,
        description: formDescription.trim(),
      };
      setCriteria((prev) => [...prev, newCriterion]);
      toast('Criterion added', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (criteria.length <= 1) {
      toast('At least one criterion must exist', 'error');
      return;
    }
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirmId(null);
    toast('Criterion deleted', 'info');
  };

  const handleSaveAll = () => {
    toast('All changes saved successfully', 'success');
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all criteria to defaults? This cannot be undone.')) {
      setCriteria(DEFAULT_CRITERIA);
      toast('Criteria reset to defaults', 'info');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-gold-500" />
              <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest">Judging Criteria</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">
              Manage Criteria <span className="text-dark-500 not-italic">/ Category</span>
            </h1>
          </div>
        </div>
        <Button onClick={openAddModal} className="shadow-xl shadow-gold-500/20">
          <Plus className="h-4 w-4 mr-2" /> Add Criteria
        </Button>
      </div>

      <Card className="border-white/5 bg-dark-900/40">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Weight Distribution</span>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${isBalanced ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {isBalanced ? (
                <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Weights balanced</span>
              ) : (
                <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Weights don't add up to 100%</span>
              )}
            </span>
          </div>
          <div className="h-3 w-full bg-dark-950 rounded-full overflow-hidden flex">
            {criteria.map((c) => (
              <motion.div
                key={c.id}
                layout
                className={`h-full ${getBarColor(c.weight)} first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${c.weight}%` }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {criteria.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5 text-[10px] text-dark-500">
                <div className={`h-2 w-2 rounded-full ${c.weight >= 30 ? 'bg-gold-500' : c.weight >= 20 ? 'bg-gold-500/70' : 'bg-dark-600'}`} />
                {c.name} ({c.weight}%)
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {criteria.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`border ${getWeightColor(c.weight)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-dark-600 cursor-grab">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="text-lg font-serif text-white italic">{c.name}</h3>
                          <p className="text-sm text-dark-400">{c.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(c)} className="h-9 w-9 rounded-lg bg-white/5">
                            <Pencil className="h-4 w-4 text-dark-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteConfirmId(c.id)}
                            disabled={criteria.length <= 1}
                            className="h-9 w-9 rounded-lg bg-white/5 hover:bg-rose-500/10 disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4 text-dark-400" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Weight</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={c.weight}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setCriteria((prev) => prev.map((x) => (x.id === c.id ? { ...x, weight: val } : x)));
                              }}
                              className="flex-1 h-1 bg-dark-800 rounded-full appearance-none cursor-pointer accent-gold-500"
                            />
                            <span className="text-sm font-bold text-white w-12 text-right">{c.weight}%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Max Score</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={c.maxScore}
                              onChange={(e) => {
                                const val = Math.max(1, parseInt(e.target.value) || 1);
                                setCriteria((prev) => prev.map((x) => (x.id === c.id ? { ...x, maxScore: val } : x)));
                              }}
                              className="h-10 w-20 rounded-lg border border-white/10 bg-dark-900/50 px-3 text-sm text-white focus:border-gold-500/50 focus:outline-none"
                            />
                            <span className="text-xs text-dark-500">/ 100</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Description</label>
                          <input
                            type="text"
                            value={c.description}
                            onChange={(e) => {
                              setCriteria((prev) => prev.map((x) => (x.id === c.id ? { ...x, description: e.target.value } : x)));
                            }}
                            className="h-10 w-full rounded-lg border border-white/10 bg-dark-900/50 px-3 text-sm text-white focus:border-gold-500/50 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <Button variant="ghost" onClick={handleResetDefaults} className="text-dark-400 hover:text-white">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
        </Button>
        <Button onClick={handleSaveAll} className="px-8 shadow-xl shadow-gold-500/20">
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl glass-panel p-8 space-y-6 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-white italic">{editingId ? 'Edit Criterion' : 'Add Criterion'}</h2>
                <button onClick={() => setModalOpen(false)} className="text-dark-500 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none"
                    placeholder="Criterion name"
                  />
                  {formErrors.name && <p className="text-xs text-rose-500">{formErrors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Weight (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formWeight}
                      onChange={(e) => setFormWeight(parseInt(e.target.value) || 0)}
                      className="h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none"
                    />
                    {formErrors.weight && <p className="text-xs text-rose-500">{formErrors.weight}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Max Score</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formMaxScore}
                      onChange={(e) => setFormMaxScore(parseInt(e.target.value) || 1)}
                      className="h-12 w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 text-sm text-white focus:border-gold-500/50 focus:outline-none"
                    />
                    {formErrors.maxScore && <p className="text-xs text-rose-500">{formErrors.maxScore}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-dark-900/50 px-4 py-3 text-sm text-white focus:border-gold-500/50 focus:outline-none resize-none"
                    placeholder="Describe what this criterion evaluates"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveModal} className="px-6 shadow-xl shadow-gold-500/20">Save</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl glass-panel p-8 space-y-6 border border-rose-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Trash2 className="h-6 w-6 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-xl font-serif text-white italic">Delete this criterion?</h2>
                  <p className="text-sm text-dark-400 mt-1">Weights will need rebalancing after deletion.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-6 bg-rose-500 text-white hover:bg-rose-400 shadow-xl shadow-rose-500/20"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
