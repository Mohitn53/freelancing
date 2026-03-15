// ProfilePage.jsx – full profile with order history, addresses, payment methods
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, MapPin, CreditCard, LogOut, ChevronRight, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { profileApi } from '../services/api';

const fmt = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const TABS = [
  { id: 'profile', label: 'Profile Settings', icon: User },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'addresses', label: 'Address Book', icon: MapPin },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard },
];

// ─── Mock data (used when backend not connected) ─────────────────────────────
const MOCK_ORDERS = [
  { id: 'ORD-1001', created_at: '2025-12-10', status: 'Delivered', total: 15800, order_items: [{ products: { name: 'Core Hoodie', image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=100&q=80' }, quantity: 1 }] },
  { id: 'ORD-1002', created_at: '2026-01-22', status: 'In Transit', total: 7400, order_items: [{ products: { name: 'Essential Tank', image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80' }, quantity: 2 }] },
];

const MOCK_ADDRESSES = [
  { id: 1, full_name: 'Mohit Sharma', line1: '42 Streetwear Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '+91 98765 43210', is_default: true },
];

const MOCK_PAYMENTS = [
  { id: 1, brand: 'Visa', last4: '4242', exp_month: 12, exp_year: 2027, is_default: true },
];

const StatusBadge = ({ status }) => {
  const colors = { Delivered: 'bg-green-50 text-green-600', 'In Transit': 'bg-blue-50 text-blue-600', Pending: 'bg-yellow-50 text-yellow-700', Cancelled: 'bg-red-50 text-red-600' };
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ full_name: 'Mohit Sharma', email: 'mohit@dropcodes.in', phone: '' });
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });

  useEffect(() => {
    // Load from API if token exists
    const token = localStorage.getItem('dropcode_token');
    if (!token) return;
    profileApi.get().then(r => r.data && setProfile(r.data)).catch(() => {});
    profileApi.orders().then(r => r.data?.length && setOrders(r.data)).catch(() => {});
    profileApi.addresses().then(r => r.data?.length && setAddresses(r.data)).catch(() => {});
    profileApi.paymentMethods().then(r => r.data?.length && setPayments(r.data)).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await profileApi.update({ full_name: profile.full_name, phone: profile.phone });
    } catch {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddAddress = async () => {
    try {
      const res = await profileApi.addAddress(newAddress);
      setAddresses(prev => [...prev, res.data]);
    } catch {
      setAddresses(prev => [...prev, { ...newAddress, id: Date.now() }]);
    }
    setShowAddressForm(false);
    setNewAddress({ full_name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '', is_default: false });
  };

  const handleDeleteAddress = async (id) => {
    try { await profileApi.deleteAddress(id); } catch {}
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const initials = profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="w-full max-w-[1440px] mx-auto px-5 md:px-10 py-16">

      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="w-72 shrink-0">
          {/* Avatar */}
          <div className="flex flex-col items-center pb-8 border-b border-gray-100 mb-6">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-[3px_4px_0px_#555]">
              {initials}
            </div>
            <h3 className="font-bold text-lg tracking-tight">{profile.full_name}</h3>
            <p className="text-gray-400 text-sm mt-1">{profile.email}</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-primary text-white shadow-[2px_3px_0px_#555]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                    }`}
                >
                  <Icon size={17} />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                </button>
              );
            })}
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-all text-left cursor-pointer mt-4">
              <LogOut size={17} /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* ─── Profile Settings ─── */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold tracking-tight mb-8">Profile Settings</h2>
                <div className="flex flex-col gap-6 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <input type="text" value={profile.full_name}
                        onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                        className="border-2 border-gray-200 rounded-xl px-4 py-3 font-sans outline-none focus:border-primary transition-colors text-sm" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Phone</label>
                      <input type="tel" value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="border-2 border-gray-200 rounded-xl px-4 py-3 font-sans outline-none focus:border-primary transition-colors text-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input type="email" value={profile.email} disabled
                      className="border-2 border-gray-100 rounded-xl px-4 py-3 font-sans bg-gray-50 text-gray-400 text-sm cursor-not-allowed" />
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving}
                    className={`w-fit flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer border-2
                      ${saved ? 'bg-green-500 text-white border-green-500' : 'bg-primary text-white border-primary shadow-[2px_3px_0px_#111] hover:-translate-y-0.5'}`}>
                    {saved ? <><Check size={16} /> Saved!</> : saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── Orders ─── */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold tracking-tight mb-8">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <Package size={48} className="mx-auto mb-4 opacity-30" />
                    <p>No orders yet. Start shopping!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map(order => (
                      <div key={order.id} className="border-2 border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-bold text-sm">{order.id}</p>
                            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold">{fmt(order.total)}</p>
                            <StatusBadge status={order.status} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {order.order_items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img src={item.products?.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="text-xs text-gray-600">{item.products?.name} × {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Addresses ─── */}
            {activeTab === 'addresses' && (
              <motion.div key="addresses" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold tracking-tight">Address Book</h2>
                  <button onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm border-2 border-primary shadow-[2px_3px_0px_#111] hover:-translate-y-0.5 transition-all cursor-pointer">
                    <Plus size={16} /> Add Address
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`border-2 rounded-2xl p-5 relative ${addr.is_default ? 'border-primary' : 'border-gray-100'}`}>
                      {addr.is_default && <span className="absolute top-4 right-4 text-xs font-semibold bg-neon text-primary px-2 py-0.5 rounded-full">Default</span>}
                      <p className="font-bold mb-1">{addr.full_name}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />{addr.city}, {addr.state} – {addr.pincode}</p>
                      <p className="text-sm text-gray-500 mt-1">{addr.phone}</p>
                      <div className="flex gap-2 mt-4">
                        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer"><Edit2 size={13} /> Edit</button>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <div className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl p-6">
                    <h3 className="font-bold mb-5">New Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['full_name', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map(field => (
                        <div key={field} className={`flex flex-col gap-1.5 ${field === 'line1' ? 'col-span-2' : ''}`}>
                          <label className="text-xs font-medium capitalize">{field.replace('_', ' ')}</label>
                          <input type="text" value={newAddress[field]}
                            onChange={e => setNewAddress(p => ({ ...p, [field]: e.target.value }))}
                            className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={handleAddAddress}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm border-2 border-primary shadow-[2px_3px_0px_#111] cursor-pointer">
                        Save Address
                      </button>
                      <button onClick={() => setShowAddressForm(false)}
                        className="px-6 py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 cursor-pointer hover:border-primary">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Payment Methods ─── */}
            {activeTab === 'payments' && (
              <motion.div key="payments" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold tracking-tight mb-8">Payment Methods</h2>
                <div className="flex flex-col gap-4 max-w-lg">
                  {payments.map(pm => (
                    <div key={pm.id} className={`border-2 rounded-2xl p-5 flex items-center justify-between ${pm.is_default ? 'border-primary' : 'border-gray-100'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <CreditCard size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{pm.brand} •••• {pm.last4}</p>
                          <p className="text-xs text-gray-400">Expires {pm.exp_month}/{pm.exp_year}</p>
                        </div>
                      </div>
                      {pm.is_default && <span className="text-xs font-semibold bg-neon text-primary px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex items-center gap-3 text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    <Plus size={20} />
                    <span className="text-sm font-medium">Add Payment Method</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
