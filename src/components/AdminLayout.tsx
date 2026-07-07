import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { LayoutDashboard, Package, ShoppingBag, FolderOpen, FileSpreadsheet, Settings, ShieldCheck, Sun, Moon, LogOut } from 'lucide-react';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminProductsView } from './AdminProductsView';
import { AdminOrdersView } from './AdminOrdersView';
import { AdminOtherManagers } from './AdminOtherManagers';
import { AdminReportsView } from './AdminReportsView';

interface AdminLayoutProps {
  onExitAdmin: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onExitAdmin }) => {
  const { settings, editSettings, triggerToast } = useApp();
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'orders' | 'directories' | 'reports' | 'settings'>('dashboard');

  // Local settings states
  const [compName, setCompName] = useState(settings.companyName);
  const [logo, setLogo] = useState(settings.companyLogo);
  const [addr, setAddr] = useState(settings.address);
  const [ph, setPh] = useState(settings.phone);
  const [em, setEm] = useState(settings.email);
  const [curr, setCurr] = useState(settings.currency);
  const [vat, setVat] = useState(settings.vatPercent);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    editSettings({
      ...settings,
      companyName: compName,
      companyLogo: logo,
      address: addr,
      phone: ph,
      email: em,
      currency: curr,
      vatPercent: vat
    });
    triggerToast('Settings Updated', 'Company metadata and VAT rules applied successfully.', 'success');
  };

  return (
    <div id="admin-workspace" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* Top Admin Workspace Header */}
      <header className="bg-teal-900 text-white px-6 py-4 flex justify-between items-center border-b border-teal-950 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="bg-teal-850 p-2 rounded-xl text-teal-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-sm uppercase tracking-wider">{settings.companyName} ADMIN</h1>
            <span className="text-[10px] text-teal-300 font-mono">Secured Wholesale Supply Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onExitAdmin}
            className="py-1.5 px-3 bg-teal-850 hover:bg-teal-800 rounded-lg text-xs font-semibold text-teal-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Buyer View
          </button>
        </div>
      </header>

      {/* Primary Grid Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Workspace Sidebar Tabs Navigation */}
        <div className="md:col-span-1 flex flex-col gap-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-xs self-start">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              adminTab === 'dashboard'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Summary
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              adminTab === 'products'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" /> Medications
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              adminTab === 'orders'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Requisitions
          </button>

          <button
            onClick={() => setAdminTab('directories')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              adminTab === 'directories'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FolderOpen className="w-4 h-4" /> Directory
          </button>

          <button
            onClick={() => setAdminTab('reports')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              adminTab === 'reports'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> reports
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors cursor-pointer ${
              adminTab === 'settings'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* Tab Panel Window */}
        <main className="md:col-span-5 flex flex-col gap-6">
          {adminTab === 'dashboard' && <AdminDashboardView />}
          {adminTab === 'products' && <AdminProductsView />}
          {adminTab === 'orders' && <AdminOrdersView />}
          {adminTab === 'directories' && <AdminOtherManagers />}
          {adminTab === 'reports' && <AdminReportsView />}

          {adminTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                Global Wholesale Configs
              </h2>

              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Corporate Company Name</label>
                  <input
                    type="text" required value={compName} onChange={(e) => setCompName(e.target.value)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Company Logo Vector URL</label>
                  <input
                    type="text" required value={logo} onChange={(e) => setLogo(e.target.value)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Logistics Hub Address</label>
                  <input
                    type="text" required value={addr} onChange={(e) => setAddr(e.target.value)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Contact Telephone Coordinates</label>
                  <input
                    type="text" required value={ph} onChange={(e) => setPh(e.target.value)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Corporate Communication Email</label>
                  <input
                    type="email" required value={em} onChange={(e) => setEm(e.target.value)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Default Currency Prefix symbol</label>
                  <input
                    type="text" required value={curr} onChange={(e) => setCurr(e.target.value)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">National VAT Taxation Rule (%)</label>
                  <input
                    type="number" required min="0" max="100" value={vat} onChange={(e) => setVat(parseFloat(e.target.value) || 0)}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Save Config Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
