'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { getAdminUsers, deleteAdminUser, updateAdminUserRole } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'customer' | 'admin' | 'superadmin';
};

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const fetchUsers = async () => {
    try {
      const data = await getAdminUsers(token!);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteAdminUser(token!, id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const roleUpdateHandler = async (id: string, role: string) => {
    try {
      await updateAdminUserRole(token!, id, role);
      setUsers(users.map(u => u._id === id ? { ...u, role: role as any } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredUsers = users.filter((u) =>
    (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end border-b border-muted/20 pb-4">
        <div>
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Customers</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">User Management</p>
        </div>
      </div>

      <div className="bg-[#050507] border border-muted/20 flex flex-col gap-6">
        <div className="p-4 border-b border-muted/20 flex gap-4">
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[#0a0a0e] border border-muted/30 px-4 py-2 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {error && <div className="px-6 py-4 text-red-500 bg-red-500/10 border-b border-red-500/20">{error}</div>}

        <div className="w-full overflow-x-auto p-6 pt-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-sans text-xs uppercase tracking-widest text-secondary border-b border-muted/20">
                <th className="pb-4 pr-4">ID</th>
                <th className="pb-4 px-4">Name</th>
                <th className="pb-4 px-4">Email</th>
                <th className="pb-4 px-4 text-center">Role</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-white">
              <AnimatePresence>
                {filteredUsers.map((u) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-muted/10 last:border-0 hover:bg-muted/5 transition-colors"
                  >
                    <td className="py-4 pr-4 text-secondary font-mono text-xs">#{u._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-4 font-bold">{u.firstName} {u.lastName}</td>
                    <td className="py-4 px-4 text-secondary">{u.email}</td>
                    <td className="py-4 px-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => roleUpdateHandler(u._id, e.target.value)}
                        disabled={u._id === currentUser?._id || currentUser?.role !== 'superadmin'}
                        className="bg-[#0a0a0e] border border-muted/30 px-2 py-1 rounded text-xs uppercase tracking-widest text-white outline-none focus:border-primary disabled:opacity-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td className="py-4 pl-4 text-right flex justify-end gap-4">
                      {u._id !== currentUser?._id && currentUser?.role === 'superadmin' && (
                        <button
                          onClick={() => deleteHandler(u._id)}
                          className="text-red-500 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-secondary font-sans text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
