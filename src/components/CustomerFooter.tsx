import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Mail, Phone, MapPin, ShieldAlert, ArrowUpCircle } from 'lucide-react';

interface CustomerFooterProps {
  onOpenAdminLogin: () => void;
  onPageChange: (page: 'shop' | 'dashboard') => void;
}

export const CustomerFooter: React.FC<CustomerFooterProps> = ({ onOpenAdminLogin, onPageChange }) => {
  const { settings, triggerToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    triggerToast(
      'Subscription Successful',
      'Your email has been added to our trade alerts, price drops, and stock updates.',
      'success'
    );
    setNewsletterEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="customer-footer" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-6 relative">
      {/* WhatsApp & Float Help Chat (represented inside footer or floating, let's include links and help triggers) */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2">
        {/* WhatsApp Direct Line */}
        <a
          href="https://wa.me/8801711223344"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
          title="WhatsApp Corporate Desk"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.03-5.118-2.91-6.999-1.88-1.882-4.36-2.914-7.001-2.915-5.442 0-9.865 4.421-9.87 9.867-.002 1.82.478 3.595 1.39 5.182l-.183.67L1.93 21.67l3.902-.999-.285-.477z" />
          </svg>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold whitespace-nowrap">
            Trade Support WhatsApp
          </span>
        </a>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 z-40 p-3 bg-[#0F766E] hover:bg-[#14B8A6] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Scroll to Top"
      >
        <ArrowUpCircle className="w-5 h-5" />
      </button>

      {/* Main Footer Contents */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: About PharmaShip */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
            <span>🚢</span> {settings.companyName.split(' ')[0]}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            PharmaShip Wholesale Corp. is the leading medical distribution platform supplying high-margin FDA & WHO certified medicines, vaccines, and surgical supplies directly to registered pharmacies and hospitals.
          </p>
          <div className="flex gap-2.5 mt-2">
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono font-bold">GDP Compliant</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono font-bold">Cold Chain Secured</span>
          </div>
        </div>

        {/* Col 2: Corporate Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Corporate Contacts</h4>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#14B8A6] mt-0.5 flex-shrink-0" />
              <span>{settings.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
              <span>{settings.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
              <span>{settings.email}</span>
            </div>
          </div>
        </div>

        {/* Col 3: Quick Portals */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Trade Portals</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              <button onClick={() => onPageChange('shop')} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                Wholesale Pharmacy Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onPageChange('dashboard')} className="hover:text-teal-400 transition-colors cursor-pointer text-left">
                Registered Buyer Dashboard
              </button>
            </li>
            <li>
              <button onClick={onOpenAdminLogin} className="hover:text-teal-400 transition-colors cursor-pointer text-left flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-500" /> Administrator Panel
              </button>
            </li>
            <li>
              <a href="https://www.dgda.gov.bd/" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors text-left">
                Drug Regulatory Authority (DGDA)
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Wholesale Trade Alerts</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Subscribe to our corporate wholesale bulletins to receive real-time stock lists, low-stock alarms, and weekly discount margins.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-1.5 mt-2">
            <input
              type="email"
              placeholder="pharmacy@corporate.com"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 p-2 bg-slate-800 text-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#14B8A6] border border-slate-700"
            />
            <button
              type="submit"
              className="py-2 px-3 bg-[#14B8A6] hover:bg-[#0F766E] text-white rounded-lg text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Copyright line */}
      <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-3">
        <span>© 2026 PharmaShip Wholesale Corporation. All Rights Reserved.</span>
        <div className="flex gap-4 font-mono text-[10px]">
          <span className="hover:text-slate-400 cursor-pointer">Security Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Wholesale Terms</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer" onClick={onOpenAdminLogin}>System Admin Login</span>
        </div>
      </div>
    </footer>
  );
};
