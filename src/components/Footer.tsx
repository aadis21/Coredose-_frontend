import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-16 px-8 border-t border-muted/20 mt-auto bg-[#050507]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-secondary font-sans">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bebas tracking-wider text-primary">COREDOSE&reg;</h1>
          <p className="text-sm font-light opacity-70">
            Fuel the machine. Science-backed premium supplements designed for maximum performance and purity.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Shop</h4>
          <Link href="/shop/creatine" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Creatine</Link>
          <Link href="/shop/protein" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Protein</Link>
          <Link href="/shop/pre-workout" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Pre-Workout</Link>
          <Link href="/shop/apparel" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Apparel</Link>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Support</h4>
          <Link href="/faq" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">FAQ</Link>
          <Link href="/shipping" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Shipping & Returns</Link>
          <Link href="/contact" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Contact Us</Link>
          <Link href="/track" className="text-sm opacity-70 hover:text-primary hover:opacity-100 transition-colors">Track Order</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Newsletter</h4>
          <p className="text-sm opacity-70 font-light">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border border-muted/50 px-4 py-2 w-full text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary text-[#050507] px-4 py-2 font-bold uppercase hover:bg-white transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-muted/20 flex flex-col md:flex-row justify-between items-center opacity-50 text-xs">
        <p>&copy; {new Date().getFullYear()} CoreDose&reg;. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
