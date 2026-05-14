'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { getAdminStats } from '@/lib/api';
import { motion } from 'framer-motion';

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
};

type RecentOrder = {
  _id: string;
  user: { firstName: string; lastName: string };
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
};

type LowStockProduct = {
  _id: string;
  name: string;
  stock: number;
};

type MonthlySale = {
  _id: number;
  revenue: number;
  count: number;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getAdminStats(token)
        .then((data) => {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
          setLowStockProducts(data.lowStockProducts);
          setMonthlySales(data.monthlySales);
          setError(null);
        })
        .catch((err) => {
          console.error('Stats fetch error:', err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-500/10 p-4 border border-red-500/20">{error}</div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats?.totalRevenue.toLocaleString()}`, color: 'text-primary' },
    { title: 'Orders', value: stats?.totalOrders.toString(), color: 'text-white' },
    { title: 'Customers', value: stats?.totalUsers.toString(), color: 'text-white' },
    { title: 'Products', value: stats?.totalProducts.toString(), color: 'text-white' },
  ];

  const maxRevenue = Math.max(...monthlySales.map(m => m.revenue), 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Overview</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Platform Performance Metrics</p>
        </div>
        <div className="text-right">
          <p className="font-sans text-[10px] uppercase tracking-widest text-secondary">Last Sync</p>
          <p className="font-sans text-xs text-white">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-12 h-12 rounded-full border-4 border-primary" />
            </div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-secondary relative z-10">{stat.title}</h3>
            <div className="flex items-end justify-between relative z-10">
              <span className={`font-bebas text-4xl ${stat.color}`}>{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Analytics Chart (Simple Bar) */}
      <div className="bg-[#050507] border border-muted/20 p-8 flex flex-col gap-8 shadow-xl">
        <h3 className="font-bebas text-2xl tracking-wide text-white">Revenue Analytics</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {MONTHS.map((month, idx) => {
            const sale = monthlySales.find(m => m._id === idx + 1);
            const height = sale ? (sale.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                <div className="relative w-full flex justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: idx * 0.05 }}
                    className="w-full max-w-[40px] bg-primary/20 border-t-2 border-primary group-hover:bg-primary/40 transition-colors relative"
                  >
                    {sale && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#050507] text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-20">
                        ₹{sale.revenue.toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                </div>
                <span className="font-sans text-[10px] uppercase tracking-widest text-secondary group-hover:text-white transition-colors">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-6 shadow-xl">
          <h3 className="font-bebas text-2xl tracking-wide text-white">Recent Orders</h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-sans text-xs uppercase tracking-widest text-secondary border-b border-muted/20">
                  <th className="pb-4 pr-4">ID</th>
                  <th className="pb-4 px-4">Customer</th>
                  <th className="pb-4 px-4 text-right">Total</th>
                  <th className="pb-4 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-white">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-muted/10 last:border-0 hover:bg-muted/5 transition-colors">
                    <td className="py-4 pr-4 text-secondary font-mono text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-4">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-primary">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="py-4 pl-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${order.isPaid ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-6 shadow-xl">
          <h3 className="font-bebas text-2xl tracking-wide text-white">Inventory Alerts</h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-sans text-xs uppercase tracking-widest text-secondary border-b border-muted/20">
                  <th className="pb-4 pr-4">Product</th>
                  <th className="pb-4 px-4 text-right">Stock</th>
                  <th className="pb-4 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-white">
                {lowStockProducts.map((product) => (
                  <tr key={product._id} className="border-b border-muted/10 last:border-0 hover:bg-muted/5 transition-colors">
                    <td className="py-4 pr-4 font-bold">{product.name}</td>
                    <td className="py-4 px-4 text-right">{product.stock}</td>
                    <td className="py-4 pl-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${product.stock === 0 ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
                {lowStockProducts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-secondary font-sans text-sm">
                      All products are well stocked.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
