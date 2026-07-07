import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Order, Customer } from '../types';
import { LayoutDashboard, ShoppingBag, MapPin, KeyRound, BellRing, Receipt, Truck, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomerDashboardViewProps {
  onViewInvoice: (order: Order) => void;
}

export const CustomerDashboardView: React.FC<CustomerDashboardViewProps> = ({ onViewInvoice }) => {
  const {
    currentUser,
    setCurrentUser,
    customers,
    addCustomer,
    orders,
    notifications,
    editCustomer,
    triggerToast,
    settings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'notifications' | 'password'>('dashboard');
  
  // Login and registration form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regArea, setRegArea] = useState('');
  const [regDistrict, setRegDistrict] = useState('Dhaka');

  // Address form states
  const [address, setAddress] = useState(currentUser?.address || '');
  const [area, setArea] = useState(currentUser?.area || '');
  const [district, setDistrict] = useState(currentUser?.district || '');

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginEmail.trim().toLowerCase();
    const phoneQuery = loginPhone.trim();
    
    const matched = customers.find(
      c => c.email.toLowerCase() === query || c.phone === phoneQuery || c.email.toLowerCase().includes(query)
    );

    if (matched) {
      setCurrentUser(matched);
      triggerToast(
        'B2B Session Established',
        `Successfully logged in as ${matched.name}. Corporate discount rates applied.`,
        'success'
      );
    } else {
      triggerToast(
        'Authentication Failed',
        'No registered wholesale buyer matches these credentials. Try using one of our demo partner shortcuts.',
        'error'
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone) {
      triggerToast('Incomplete Form', 'Please provide all required wholesale registry details.', 'warning');
      return;
    }

    const newBuyer: Omit<Customer, 'id' | 'totalPurchase' | 'dueAmount'> = {
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      area: regArea,
      district: regDistrict,
      status: 'active'
    };

    addCustomer(newBuyer);
    triggerToast(
      'Wholesale Registry Success',
      `Pharmacy "${regName}" is now pending regulatory review. Logged in automatically!`,
      'success'
    );
    
    // Automatically log in as the newly registered customer
    setTimeout(() => {
      const refreshedCustomers = JSON.parse(localStorage.getItem('ps_customers') || '[]');
      const newlyAdded = refreshedCustomers.find((c: any) => c.email.toLowerCase() === regEmail.toLowerCase()) || {
        id: `cust-${Date.now()}`,
        ...newBuyer,
        totalPurchase: 0,
        dueAmount: 0
      };
      setCurrentUser(newlyAdded);
    }, 100);

    setIsRegistering(false);
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300">
          <div className="text-center mb-6">
            <span className="text-3xl">🚢</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mt-2 tracking-tight">
              {isRegistering ? 'Register B2B Pharmacy Account' : 'Registered Pharmacy Portal'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {isRegistering 
                ? 'Submit your regulatory information to apply for wholesale pricing.'
                : 'Access clinical drug inventories, Net-30 credit lines, and corporate order logs.'
              }
            </p>
          </div>

          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Pharmacy / Clinic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Pharmacy Ltd."
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="pharmacy@corp.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Drug License/Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Corporate Delivery Address</label>
                <input
                  type="text"
                  placeholder="Street address, building number..."
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Area / Thana</label>
                  <input
                    type="text"
                    placeholder="e.g. Gulshan"
                    value={regArea}
                    onChange={e => setRegArea(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">District</label>
                  <select
                    value={regDistrict}
                    onChange={e => setRegDistrict(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Submit B2B Application
              </button>

              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="w-full py-2 text-slate-500 text-xs font-semibold hover:text-[#0F766E] text-center"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Registered Corporate Email</label>
                  <input
                    type="email"
                    placeholder="buyer@hospital.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Access Token / Password</label>
                    <span className="text-[10px] text-[#14B8A6] font-mono select-none">Demo Mode Active</span>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    defaultValue="demo123"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-[#14B8A6] focus:border-[#14B8A6] focus:bg-white dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#14B8A6] hover:bg-[#0F766E] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  Establish Secure Session
                </button>
              </form>

              {/* DEMO PARTNER LOGINS */}
              <div className="border-t border-gray-100 dark:border-slate-800 pt-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">
                  Fast Demo Partner Sessions
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {customers.slice(0, 3).map((cust) => (
                    <button
                      key={cust.id}
                      onClick={() => {
                        setCurrentUser(cust);
                        triggerToast('Demo Session Established', `Logged in as registered buyer: ${cust.name}`, 'success');
                      }}
                      className="p-2 text-left bg-gray-50 hover:bg-teal-50 dark:bg-slate-950 dark:hover:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-350 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <span className="font-bold block truncate group-hover:text-[#0F766E]">{cust.name}</span>
                        <span className="text-[9px] text-slate-400 block truncate">{cust.email}</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 py-0.5 px-1.5 rounded flex-shrink-0">
                        Select
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 text-center">
                <span className="text-xs text-slate-400">New corporate pharmacy?</span>{' '}
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-xs font-bold text-[#14B8A6] hover:text-[#0F766E] cursor-pointer"
                >
                  Register Here
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Filter orders matching current logged customer
  const clientOrders = orders.filter(
    (o) =>
      o.customerDetails.name.toLowerCase() === currentUser.name.toLowerCase() ||
      o.customerDetails.phone === currentUser.phone
  );

  const pendingOrders = clientOrders.filter((o) => o.status === 'pending' || o.status === 'accepted' || o.status === 'packed' || o.status === 'shipping');

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Customer = {
      ...currentUser,
      address,
      area,
      district
    };
    editCustomer(updated);
    triggerToast('Address Saved', 'Your corporate delivery address has been updated.', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      triggerToast('Password Mismatch', 'Confirm password does not match.', 'error');
      return;
    }
    triggerToast('Password Changed', 'Your B2B account password has been updated securely.', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Pending</span>;
      case 'accepted':
        return <span className="bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Accepted</span>;
      case 'packed':
        return <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">📦 Packed</span>;
      case 'shipping':
        return <span className="bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Truck className="w-3 h-3 animate-bounce" /> Shipping</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">✓ Delivered</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider">✕ Cancelled</span>;
    }
  };

  return (
    <div id="customer-dashboard" className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-1 md:col-span-1">
        <div className="px-3 py-4 border-b border-slate-100 dark:border-slate-800 mb-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold text-lg mx-auto md:mx-0 mb-2">
            {currentUser.name.charAt(0)}
          </div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">{currentUser.name}</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> B2B Dashboard
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Wholesale Orders ({clientOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
            activeTab === 'addresses'
              ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" /> Delivery Addresses
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <BellRing className="w-4 h-4" /> Supply Updates
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
            activeTab === 'password'
              ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" /> Change Password
        </button>
      </div>

      {/* Main Tab Contents */}
      <div className="md:col-span-3 flex flex-col gap-6">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            {/* Top Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-teal-850 text-white rounded-2xl border border-teal-800 shadow-sm flex flex-col gap-1 bg-gradient-to-br from-teal-900 to-teal-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">Total Procurement</span>
                <span className="text-2xl font-black font-mono">{settings.currency}{currentUser.totalPurchase.toLocaleString()}</span>
                <span className="text-[10px] text-teal-200 mt-2">Lifetime wholesale trade volume</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">Corporate Credit Due</span>
                <span className="text-2xl font-black font-mono text-rose-600 dark:text-rose-400">{settings.currency}{currentUser.dueAmount.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 mt-2">Settlement term: Net 30 Days</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600">Active Supply Queues</span>
                <span className="text-2xl font-black font-mono text-teal-750 dark:text-teal-400">{pendingOrders.length} Orders</span>
                <span className="text-[10px] text-slate-400 mt-2">Orders in packaging or transit</span>
              </div>
            </div>

            {/* Quick Orders Overview */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Recent Procurement Logs
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-teal-700 hover:underline cursor-pointer"
                >
                  View All Orders
                </button>
              </div>

              {clientOrders.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No previous orders placed yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                        <th className="py-2.5 font-bold">Order No</th>
                        <th className="py-2.5 font-bold">Date Placed</th>
                        <th className="py-2.5 font-bold">Total Amount</th>
                        <th className="py-2.5 font-bold text-center">Tracking</th>
                        <th className="py-2.5 font-bold text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {clientOrders.slice(0, 3).map((o) => (
                        <tr key={o.id}>
                          <td className="py-3 font-bold text-slate-800 dark:text-slate-100">{o.orderNumber}</td>
                          <td className="py-3 text-slate-500">{o.date}</td>
                          <td className="py-3 font-bold font-mono">{settings.currency}{o.grandTotal.toLocaleString()}</td>
                          <td className="py-3 text-center">{getStatusBadge(o.status)}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => onViewInvoice(o)}
                              className="py-1 px-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 cursor-pointer flex items-center gap-1.5 ml-auto"
                            >
                              <Receipt className="w-3 h-3" /> View Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              Comprehensive Procurement Records
            </h3>

            {clientOrders.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6">No previous orders placed yet.</p>
            ) : (
              <div className="space-y-4">
                {clientOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{o.orderNumber}</h4>
                        {getStatusBadge(o.status)}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 space-x-3">
                        <span>Date: <strong>{o.date}</strong></span>
                        <span>•</span>
                        <span>Items: <strong>{o.items.length} packs</strong></span>
                        <span>•</span>
                        <span>Delivery: <strong>{o.estimatedDelivery} (Est.)</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">Invoice Value</span>
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100 font-mono">
                          {settings.currency}{o.grandTotal.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => onViewInvoice(o)}
                        className="py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <Receipt className="w-4 h-4" /> View Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <form onSubmit={handleUpdateAddress} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              Delivery Logistics Coordinates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Street / Clinical Delivery Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 dark:text-white"
                  placeholder="Street name, floor, landmark, etc."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Area Sector</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 dark:text-white"
                  placeholder="e.g. Dhanmondi, Gulshan"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">District Region</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 dark:text-white"
                  placeholder="e.g. Dhaka, Chittagong"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Recipient Phone Contact</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.phone}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm transition-all"
            >
              Update Logistics Settings
            </button>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              Clinical Supply Bulletins
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.filter(n => n.title.includes('Order') || n.title.includes('Welcome') || n.title.includes('Offer')).map((n) => (
                <div key={n.id} className="p-3.5 bg-slate-50/60 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="text-teal-600 bg-teal-50 dark:bg-teal-950/20 p-1.5 rounded-full mt-0.5">
                    <BellRing className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">{n.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-2">{n.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              Change Security Password
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 dark:text-white"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 dark:text-white"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 dark:text-white"
                  placeholder="Re-type new password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm transition-all"
            >
              Update Security Credentials
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
