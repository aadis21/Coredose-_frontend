import Link from 'next/link';

export default function SciencePage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden border-b border-muted/10">
        <div className="absolute inset-0 bg-[url('/images/science-bg.jpg')] bg-cover bg-center opacity-10 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507] z-0" />
        
        <div className="relative z-10 text-center px-4">
          <h2 className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-primary mb-4">
            Research & Development
          </h2>
          <h1 className="text-6xl md:text-8xl font-bebas text-white tracking-wider mb-6">
            THE SCIENCE OF <span className="text-primary">PERFORMANCE</span>
          </h1>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto flex flex-col gap-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-5xl font-bebas tracking-wide text-white">CLINICALLY DOSED. ALWAYS.</h2>
            <p className="font-sans text-secondary leading-relaxed">
              We engineer our formulas based on peer-reviewed scientific studies. If an ingredient doesn&apos;t have clinical backing, it doesn&apos;t make the cut. Every serving provides the exact dosage proven to elicit the desired physiological response.
            </p>
          </div>
          <div className="aspect-[4/3] bg-[#0a0a0e] border border-muted/20 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="font-bebas text-3xl text-muted opacity-20 tracking-widest relative z-10">LAB VISUAL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row-reverse">
          <div className="flex flex-col gap-6">
            <h2 className="text-5xl font-bebas tracking-wide text-white">THIRD-PARTY TESTED</h2>
            <p className="font-sans text-secondary leading-relaxed">
              Trust is earned, not given. That&apos;s why every batch of CoreDose supplements undergoes rigorous 3rd party testing for heavy metals, microbial contaminants, and ingredient verification. We guarantee that what&apos;s on the label is in the bottle.
            </p>
          </div>
          <div className="aspect-[4/3] bg-[#0a0a0e] border border-muted/20 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="font-bebas text-3xl text-muted opacity-20 tracking-widest relative z-10">TESTING VISUAL</span>
          </div>
        </div>

      </section>

      {/* Trust Badges */}
      <section className="py-16 px-8 border-t border-muted/10 bg-[#0a0a0e]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary font-bebas text-2xl">01</div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">GMP Certified</span>
          </div>
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary font-bebas text-2xl">02</div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Banned Substance Tested</span>
          </div>
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary font-bebas text-2xl">03</div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Made in USA</span>
          </div>
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary font-bebas text-2xl">04</div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">FDA Registered Facility</span>
          </div>
        </div>
      </section>
    </div>
  );
}
