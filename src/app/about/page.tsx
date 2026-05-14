import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden border-b border-muted/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0e] to-[#050507] z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-secondary mb-4 opacity-80">
            Our Philosophy
          </h2>
          <h1 className="text-6xl md:text-8xl font-bebas text-white tracking-wider mb-6 drop-shadow-2xl">
            NO EXCUSES. <span className="text-primary">NO COMPROMISES.</span>
          </h1>
          <p className="text-lg font-sans text-secondary max-w-2xl mx-auto font-light leading-relaxed">
            CoreDose was born out of frustration with an industry plagued by proprietary blends, under-dosed formulas, and false promises. We set out to create the ultimate standard in human performance engineering.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-square bg-[#0a0a0e] border border-muted/20 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-0" />
           <span className="font-bebas text-4xl text-muted opacity-20 tracking-widest relative z-10">LIFESTYLE VISUAL</span>
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-5xl font-bebas tracking-wide text-white">THE COREDOSE STANDARD</h2>
          <p className="font-sans text-secondary leading-relaxed">
            Every product we formulate goes through rigorous R&D, utilizing only clinically backed ingredients at their effective dosages. We don&apos;t hide behind proprietary blends. What you see on the label is exactly what goes into your body.
          </p>
          <ul className="flex flex-col gap-4 mt-4">
            <li className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">01</div>
              <span className="font-sans font-bold text-white uppercase tracking-widest text-sm">100% Transparency</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">02</div>
              <span className="font-sans font-bold text-white uppercase tracking-widest text-sm">Clinical Dosages</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">03</div>
              <span className="font-sans font-bold text-white uppercase tracking-widest text-sm">GMP Certified Lab</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 bg-[#0a0a0e] border-t border-muted/20 text-center">
        <h2 className="text-5xl font-bebas tracking-wide text-white mb-6">READY TO LEVEL UP?</h2>
        <Link href="/shop">
          <button className="bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest px-10 py-4 hover:bg-white transition-all shadow-[0_0_20px_rgba(26,143,255,0.4)]">
            Shop The Lineup
          </button>
        </Link>
      </section>
    </div>
  );
}
