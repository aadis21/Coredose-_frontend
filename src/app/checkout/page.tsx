'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { createRazorpayOrder, createOrder, verifyRazorpayPayment } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type ShippingAddress = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

export default function CheckoutPage() {
  const { items, clearAll } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [shipping, setShipping] = useState<ShippingAddress>({
    email: user?.email ?? '',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);
  const taxPrice = parseFloat((subtotal * 0.18).toFixed(2));
  const shippingPrice = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + taxPrice + shippingPrice;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user || !token) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Failed to load Razorpay. Please check your connection.');
        setProcessing(false);
        return;
      }

      const razorpayOrder = await createRazorpayOrder(token, total);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency ?? 'INR',
        name: 'CoreDose®',
        description: 'Premium Fitness Supplements',
        order_id: razorpayOrder.id,
        prefill: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          email: shipping.email,
        },
        theme: { color: '#1A8FFF' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyRazorpayPayment(token, response);

            await createOrder(token, {
              orderItems: items.map((i) => ({
                product: i.product,
                name: i.name,
                qty: i.qty,
                price: i.price,
              })),
              shippingAddress: {
                address: shipping.address,
                city: shipping.city,
                state: shipping.state,
                postalCode: shipping.postalCode,
                country: 'India',
              },
              paymentMethod: 'Razorpay',
              paymentResult: {
                id: response.razorpay_payment_id,
                status: 'completed',
                update_time: new Date().toISOString(),
              },
              itemsPrice: subtotal,
              taxPrice,
              shippingPrice,
              totalPrice: total,
            });

            await clearAll();
            router.push('/profile');
          } catch {
            setError('Payment verified but order creation failed. Please contact support.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-bebas text-4xl text-white mb-4">Sign In To Checkout</h1>
          <p className="font-sans text-secondary mb-6">You need to be logged in to complete your purchase.</p>
          <Link href="/login">
            <button className="bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest px-10 py-4 hover:bg-white transition-all">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-16 px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bebas tracking-wider mb-2 text-white">SECURE CHECKOUT</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-secondary mb-10">
          All transactions are 256-bit encrypted
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 bg-red-500/10 border border-red-500/30 text-red-400 font-sans text-sm px-6 py-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — Shipping Form */}
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="font-bebas text-2xl tracking-wide mb-4 border-b border-muted/20 pb-2">1. Contact Information</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  name="email"
                  value={shipping.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </section>

            <section>
              <h2 className="font-bebas text-2xl tracking-wide mb-4 border-b border-muted/20 pb-2">2. Shipping Address</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" value={shipping.firstName} onChange={handleChange} placeholder="First Name" required className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                  <input type="text" name="lastName" value={shipping.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <input type="text" name="address" value={shipping.address} onChange={handleChange} placeholder="Street Address" required className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                <div className="grid grid-cols-3 gap-4">
                  <input type="text" name="city" value={shipping.city} onChange={handleChange} placeholder="City" required className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                  <input type="text" name="state" value={shipping.state} onChange={handleChange} placeholder="State" required className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                  <input type="text" name="postalCode" value={shipping.postalCode} onChange={handleChange} placeholder="PIN Code" required className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-bebas text-2xl tracking-wide mb-4 border-b border-muted/20 pb-2">3. Payment</h2>
              <div className="bg-[#0a0a0e] border border-primary/30 p-6 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/3 pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h3 className="font-sans font-bold text-white uppercase tracking-widest text-sm">Razorpay Secure Payment</h3>
                </div>
                <p className="relative z-10 font-sans text-xs text-secondary">
                  Pay via UPI, Cards, Net Banking, or Wallets. Powered by Razorpay — India's most trusted payment gateway.
                </p>
              </div>
            </section>

            <button
              id="pay-now-btn"
              type="submit"
              disabled={processing || items.length === 0}
              className="w-full bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest py-5 hover:bg-white transition-all shadow-[0_0_30px_rgba(26,143,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {processing ? 'Initializing Payment...' : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div className="bg-[#0a0a0e] border border-muted/20 p-8 sticky top-32">
              <h2 className="font-bebas text-3xl tracking-wide border-b border-muted/20 pb-4 mb-6">Order Summary</h2>

              <div className="flex flex-col gap-4 mb-6 border-b border-muted/20 pb-6 max-h-64 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="font-sans text-sm text-secondary text-center py-4">No items in cart</p>
                ) : (
                  items.map((item) => (
                    <div key={item.product} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-[#050507] border border-muted/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[8px] text-muted font-bebas">IMG</span>
                          <span className="absolute -top-2 -right-2 bg-primary text-[#050507] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {item.qty}
                          </span>
                        </div>
                        <div>
                          <p className="font-bebas tracking-wide text-base text-white">{item.name}</p>
                        </div>
                      </div>
                      <span className="font-sans font-bold text-white flex-shrink-0">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col gap-3 font-sans text-sm text-secondary mb-6 border-b border-muted/20 pb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-green-400' : 'text-white'}>
                    {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="text-white">₹{taxPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-2">
                <span className="font-sans text-lg uppercase tracking-widest text-secondary">Total</span>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs text-secondary">INR</span>
                  <span className="font-bebas text-4xl text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              {subtotal < 2000 && (
                <p className="font-sans text-xs text-secondary mt-2">
                  Add ₹{(2000 - subtotal).toFixed(2)} more for <span className="text-green-400">FREE shipping</span>
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
