'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/authContext';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Customers' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Route guard — only admins allowed
  useEffect(() => {
    if (user === null) {
      router.push('/login');
    } else if (user && user.role !== 'admin' && user.role !== 'superadmin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-[#050507] border-r border-muted/20 flex flex-col sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="p-6 border-b border-muted/20">
          <h2 className="font-bebas tracking-widest text-2xl text-primary">
            COREDOSE<span className="text-white">_ADMIN</span>
          </h2>
          <p className="font-sans text-[10px] uppercase tracking-widest text-secondary mt-1">
            {user.role === 'superadmin' ? 'Super Admin' : 'Admin'} Panel
          </p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-4 font-sans text-sm uppercase tracking-widest">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded-sm transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10 border-l-2 border-primary'
                    : 'text-secondary hover:text-white hover:bg-[#0a0a0e]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-muted/20 flex flex-col gap-2">
          <Link href="/" className="text-secondary text-xs uppercase tracking-widest hover:text-white transition-colors">
            ← Back to Store
          </Link>
          <button
            onClick={logout}
            className="text-red-500 text-xs uppercase tracking-widest hover:text-red-400 transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0a0a0e]/30 min-h-screen">
        <header className="h-16 border-b border-muted/20 flex items-center justify-between px-8 bg-[#050507] sticky top-0 z-10">
          <div className="font-sans text-xs uppercase tracking-widest text-secondary">
            {NAV_LINKS.find((l) => l.href === pathname)?.label ?? 'Admin'}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-[#050507] text-xs">
              {user.firstName.charAt(0)}
            </div>
            <span className="font-sans text-xs uppercase tracking-widest text-secondary">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
