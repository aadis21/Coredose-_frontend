"use client";
import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Recommendation = {
  type: string;
  reason: string;
  recommendedSlug: string;
  productName: string;
};

export default function AICoachPage() {
  const [goal, setGoal] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay for dramatic effect
    setTimeout(() => {
      setRecommendations([
        {
          type: 'Protein',
          reason: 'Essential for muscle recovery and hitting daily macros based on your weight goals.',
          recommendedSlug: 'whey-isolate-pro',
          productName: 'Whey Isolate Pro'
        },
        {
          type: 'Performance',
          reason: 'To boost intensity during training sessions and accelerate goal achievement.',
          recommendedSlug: 'pre-ignite-x',
          productName: 'Pre-Ignite X'
        }
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full min-h-[90vh] bg-background text-foreground py-16 px-8 relative overflow-hidden">
      {/* Background visual */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-primary mb-4">
            AI-Powered Recommendations
          </h2>
          <h1 className="text-5xl md:text-7xl font-bebas text-white tracking-wider mb-6">
            YOUR DIGITAL <span className="text-primary">COACH</span>
          </h1>
          <p className="font-sans text-secondary max-w-xl mx-auto">
            Input your biological metrics and fitness goals. Our proprietary algorithm will engineer the exact supplement stack you need to achieve maximum performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0a0a0e] border border-muted/20 p-8"
          >
            <form onSubmit={handleAnalyze} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Primary Goal</label>
                <select 
                  className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                >
                  <option value="">Select a goal</option>
                  <option value="muscle">Build Muscle</option>
                  <option value="fatloss">Lose Fat</option>
                  <option value="endurance">Increase Endurance</option>
                  <option value="recovery">Improve Recovery</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Current Weight (lbs)</label>
                <input 
                  type="number" 
                  className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. 185"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest py-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.2)] mt-4 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Generate Stack'}
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            {loading && (
              <div className="h-full flex flex-col items-center justify-center gap-4 border border-muted/20 bg-[#0a0a0e] p-8">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-sans text-sm text-secondary uppercase tracking-widest animate-pulse">Running Neural Algorithms...</p>
              </div>
            )}

            {!loading && recommendations.length === 0 && (
              <div className="h-full flex items-center justify-center border border-muted/20 bg-[#0a0a0e]/50 p-8 text-center">
                <p className="font-sans text-sm text-secondary uppercase tracking-widest">Awaiting Input Data</p>
              </div>
            )}

            {!loading && recommendations.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-bebas text-2xl tracking-wide text-white mb-2">Recommended Stack</h3>
                {recommendations.map((rec, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    key={idx} 
                    className="bg-[#0a0a0e] border border-primary/30 p-6 flex flex-col gap-3 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-primary/20 text-primary px-3 py-1 font-sans text-[10px] uppercase tracking-widest font-bold">
                      {rec.type}
                    </div>
                    <Link href={`/shop/${rec.recommendedSlug}`}>
                      <h4 className="font-bebas text-2xl text-white hover:text-primary transition-colors cursor-pointer">{rec.productName}</h4>
                    </Link>
                    <p className="font-sans text-sm text-secondary leading-relaxed">{rec.reason}</p>
                    <Link href={`/shop/${rec.recommendedSlug}`}>
                      <span className="text-primary font-sans text-xs uppercase tracking-widest font-bold underline cursor-pointer mt-2 inline-block hover:text-white">View Product</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
