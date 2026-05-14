import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      q: "What makes CoreDose supplements different?",
      a: "We never use proprietary blends. Our formulas are completely transparent, clinically dosed, and tested by 3rd party GMP certified labs to ensure maximum purity and efficacy."
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes. CoreDose ships globally. Shipping rates and delivery times are calculated at checkout based on your region."
    },
    {
      q: "How do I take Pre-Ignite X?",
      a: "Mix one scoop with 8-10 oz of water 20-30 minutes before your workout. Assess your tolerance with half a scoop first if you are sensitive to stimulants."
    },
    {
      q: "Is your Whey Isolate Pro lactose-free?",
      a: "Our Whey Isolate undergoes an advanced micro-filtration process that removes 99% of lactose, making it highly tolerable for most individuals."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bebas tracking-wider mb-4 text-white">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Knowledge is Power</p>
        </div>

        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#0a0a0e] border border-muted/20 p-8 hover:border-primary/50 transition-colors group cursor-pointer">
              <h3 className="font-bebas text-2xl tracking-wide text-white mb-4 group-hover:text-primary transition-colors">{faq.q}</h3>
              <p className="font-sans text-secondary font-light leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center border-t border-muted/20 pt-16">
          <h2 className="font-bebas text-3xl tracking-wide text-white mb-4">Still have questions?</h2>
          <button className="bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest px-8 py-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)]">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
