'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cartContext';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateItem, clearAll, loading } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = parseFloat((subtotal * 0.1).toFixed(2)); // 10% tax
  const shippingPrice = items.length > 0 ? 5.0 : 0;
  const total = subtotal + taxPrice + shippingPrice;

  const handleQuantityChange = async (productId: string, newQty: number) => {
    if (newQty <= 0) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQty);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      try {
        await clearAll();
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="w-full min-h-[70vh] bg-background text-foreground py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bebas tracking-wider mb-12">SHOPPING CART</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="hidden md:grid grid-cols-12 text-sm font-sans font-bold uppercase tracking-widest text-secondary border-b border-muted/20 pb-4">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <h2 className="text-2xl font-bebas text-white mb-4">Your cart is empty</h2>
                <p className="text-secondary mb-6">Add some products to get started!</p>
                <Link href="/shop">
                  <button className="bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest px-8 py-3 hover:bg-white transition-all">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            ) : (
              items.map(item => (
                <div key={item.product} className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 border-b border-muted/10 pb-6">
                  <div className="col-span-1 md:col-span-6 flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#0a0a0e] border border-muted/20 flex-shrink-0 flex items-center justify-center">
                      <span className="text-[10px] text-muted">IMG</span>
                    </div>
                    <div>
                      <h3 className="font-bebas text-2xl tracking-wide text-white">{item.name}</h3>
                      <button 
                        onClick={() => removeItem(item.product)}
                        disabled={loading}
                        className="font-sans text-xs text-red-500 uppercase tracking-widest mt-2 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 text-center font-sans font-medium text-white md:block hidden">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <div className="flex border border-muted/30 w-full max-w-[100px]">
                      <button 
                        onClick={() => handleQuantityChange(item.product, item.qty - 1)}
                        disabled={loading}
                        className="flex-1 py-2 text-white hover:text-primary transition-colors disabled:opacity-50"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center justify-center text-white font-sans text-sm">{item.qty}</div>
                      <button 
                        onClick={() => handleQuantityChange(item.product, item.qty + 1)}
                        disabled={loading}
                        className="flex-1 py-2 text-white hover:text-primary transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2 text-right font-sans font-bold text-primary">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))
            )}
            
            <div className="flex justify-between items-center pt-4">
              <Link href="/shop">
                <button className="text-sm font-sans font-bold uppercase tracking-widest text-secondary hover:text-white flex items-center gap-2 transition-colors">
                  &larr; Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0e] border border-muted/20 p-8 flex flex-col gap-6 sticky top-32">
              <h2 className="font-bebas text-3xl tracking-wide border-b border-muted/20 pb-4">Order Summary</h2>
              
              <div className="flex justify-between font-sans text-secondary">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans text-secondary">
                <span>Tax (10%)</span>
                <span className="text-white">${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-sans text-secondary border-b border-muted/20 pb-6">
                <span>Shipping</span>
                <span className="text-white">${shippingPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-sans font-bold text-xl text-white">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full">
                <button 
                  disabled={items.length === 0 || loading}
                  className="w-full bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest py-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed To Checkout
                </button>
              </Link>

              {items.length > 0 && (
                <button 
                  onClick={handleClearCart}
                  disabled={isClearing || loading}
                  className="w-full bg-transparent border border-red-500 text-red-500 font-sans font-bold uppercase tracking-widest py-3 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isClearing ? 'Clearing...' : 'Clear Cart'}
                </button>
              )}

              <div className="flex justify-center gap-4 mt-4 opacity-50">
                <span className="text-xs font-sans uppercase tracking-widest text-secondary">Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
