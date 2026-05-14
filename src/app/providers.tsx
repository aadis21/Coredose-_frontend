'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/authContext';
import { CartProvider } from '@/lib/cartContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
