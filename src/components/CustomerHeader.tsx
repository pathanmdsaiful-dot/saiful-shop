import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Search, ShoppingCart, Heart, RefreshCw, Bell, User, LayoutDashboard, Menu, ShieldAlert, LogOut, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerHeaderProps {
  onSearchChange: (q: string) => void;
  onCartOpen: () => void;
  onCompareOpen: () => void;
  onPageChange: (page: 'shop' | 'dashboard') => void;
  activePage: 'shop' | 'dashboard';
  onToggleAdmin: () => void;
  selectedCategory?: string | null;
  onCategorySelect?: (catId: string | null) => void;
  showOnlyWishlist?: boolean;
  onToggleWishlistOnly?: (show: boolean) => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  onSearchChange,
  onCartOpen,
  onCompareOpen,
  onPageChange,
  activePage,
  onToggleAdmin,
  selectedCategory,
  onCategorySelect,
  showOnlyWishlist = false,
  onToggleWishlistOnly
}) => {
  const {
    cart,
    wishlist,
    compareList,
    notifications,
    markNotificationRead,
    clearNotifications,
    currentUser,
    setCurrentUser,
    searchQuery,
    setSearchQuery,
    categories,
    settings
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPageChange('shop');
    onSearchChange(searchQuery);
  };

  const handleCategorySelect = (catId: string) => {
    setSearchQuery('');
    onSearchChange('');
    if (onCategorySelect) onCategorySelect(catId);
    setCategoryMenuOpen(false);
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    onSearchChange('');
    if (onCategorySelect) onCategorySelect(null);
    onPageChange('shop');
  };

  const handleWishlistToggleClick = () => {
    if (onToggleWishlistOnly) {
      onToggleWishlistOnly(!showOnlyWishlist);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-[#14B8A6]" />;
    }
  };

  return (
    <header id="customer-sticky-header" className="sticky top-0 z-40 w-full bg-[#0F766E] shadow-md transition-all duration-300">
      {/* Top Banner / Corporate Line */}
      <div className="bg-[#0D635D] text-slate-100 text-[10px] md:text-xs py-1.5 px-4 flex justify-between items-center font-mono font-medium">
        <div className="flex items-center gap-4">
          <span>📞 Hotline: {settings.phone}</span>
          <span className="hidden md:inline">🕒 Hours: 24/7 Corporate Deliveries</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-[#0F766E] px-2 py-0.5 rounded-full text-[9px] font-bold uppercase animate-pulse">
            Corporate Margins Up To 25% Active
          </span>
          <button
            onClick={onToggleAdmin}
            className="hover:text-teal-200 cursor-pointer flex items-center gap-1 font-semibold"
          >
            <ShieldAlert className="w-3 h-3" /> Admin Portal
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Logo and Mobile controls */}
        <div className="flex items-center justify-between">
          <div
            onClick={handleLogoClick}
            className="flex flex-col cursor-pointer select-none"
          >
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none flex items-center gap-1.5">
              <span>🚢</span> {settings.companyName.split(' ')[0]}
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-teal-250 font-bold font-mono">
              Pharmacy Wholesale B2B
            </span>
          </div>

          {/* Mobile Right Action shortcuts */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={onCartOpen} className="relative p-2 text-white/90 hover:text-white cursor-pointer">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-[9px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Search and Category selector */}
        <div className="flex-1 max-w-2xl w-full flex items-center gap-2">
          {/* Categories Megamenu Button */}
          <div className="relative">
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="px-4 bg-white/10 border border-white/20 hover:bg-white/20 rounded-full text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 h-10 transition-colors"
            >
              <Menu className="w-4 h-4" /> <span className="hidden sm:inline">Categories</span>
            </button>

            <AnimatePresence>
              {categoryMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCategoryMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1.5 w-64 bg-white dark:bg-slate-950 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-20 py-2"
                  >
                    <h3 className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Medical Classifications
                    </h3>
                    <div className="max-h-80 overflow-y-auto mt-1">
                      <button
                        onClick={() => {
                          if (onCategorySelect) onCategorySelect(null);
                          setCategoryMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          !selectedCategory && !showOnlyWishlist
                            ? 'text-[#0F766E] bg-teal-50 dark:bg-teal-950/20 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#0F766E]'
                        }`}
                      >
                        All Classifications
                      </button>
                      {categories.filter(c => c.status === 'active').map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                            selectedCategory === cat.id
                              ? 'text-[#0F766E] bg-teal-50 dark:bg-teal-950/20 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#0F766E]'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center border border-white/20 rounded-full bg-white/10 overflow-hidden h-10 group focus-within:ring-2 focus-within:ring-[#14B8A6] focus-within:border-[#14B8A6] focus-within:bg-white focus-within:text-slate-800 transition-all">
            <input
              type="text"
              placeholder="Search by Medicine Name, Generic, SKU, Brand..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="flex-1 px-4 text-xs bg-transparent focus:outline-none text-white focus:text-slate-800 placeholder-white/60 focus:placeholder-slate-400"
            />
            <button type="submit" className="px-4 text-white/60 group-focus-within:text-slate-500 hover:text-white group-focus-within:hover:text-[#0F766E] cursor-pointer">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Action icons */}
        <div className="flex items-center justify-end gap-1.5 md:gap-3">
          {/* Comparison */}
          <button
            onClick={onCompareOpen}
            className={`p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors relative cursor-pointer ${
              compareList.length > 0 ? 'bg-white/15' : ''
            }`}
            title="Compare Products"
          >
            <RefreshCw className="w-4 h-4" />
            {compareList.length > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 text-[9px] font-bold text-white bg-amber-500 rounded-full flex items-center justify-center border border-[#0F766E]">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Wishlist Toggle Button */}
          <button
            onClick={handleWishlistToggleClick}
            className={`p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors relative cursor-pointer ${
              showOnlyWishlist ? 'bg-rose-500/30 text-rose-300 hover:text-rose-200' : ''
            }`}
            title="Wishlist Only Filter"
          >
            <Heart className="w-4 h-4" fill={showOnlyWishlist ? 'currentColor' : 'none'} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 text-[9px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center border border-[#0F766E]">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={`p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white transition-colors relative cursor-pointer ${
                notifOpen ? 'bg-white/10' : ''
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-0 right-0 w-4.5 h-4.5 text-[9px] font-bold text-white bg-amber-500 rounded-full flex items-center justify-center border border-[#0F766E]">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 z-20 overflow-hidden flex flex-col"
                  >
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-850 dark:text-slate-200 flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-500" /> Procurement Alerts
                      </span>
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] text-slate-500 hover:text-rose-500 cursor-pointer uppercase font-bold"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 italic">
                          No active updates or stock alarms.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`p-3 flex items-start gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors ${
                              !notif.isRead ? 'bg-teal-50/10 dark:bg-teal-950/5 border-l-2 border-teal-500' : ''
                            }`}
                          >
                            <div className="mt-0.5 flex-shrink-0">{getNotifIcon(notif.type)}</div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-slate-850 dark:text-slate-200 text-xs leading-snug">
                                {notif.title}
                              </h5>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                                {notif.message}
                              </p>
                              <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                                {notif.date}
                              </span>
                            </div>
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 bg-[#14B8A6] rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Shopping Cart Trigger */}
          <button
            onClick={onCartOpen}
            className="hidden md:flex p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white relative cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 text-[9px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center border border-[#0F766E]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Profile & Logout */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="px-3.5 bg-white/15 border border-white/20 hover:bg-white/25 rounded-full text-xs font-semibold text-white cursor-pointer flex items-center gap-1.5 h-10 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span className="truncate max-w-[100px]">{currentUser.name.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {profileDropdownOpen && (
                  <>
                     <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)} />
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: 10 }}
                       className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-950 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 z-20 py-2"
                     >
                       <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                         <p className="font-bold text-xs text-slate-850 dark:text-slate-200 truncate">{currentUser.name}</p>
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                       </div>

                       <button
                         onClick={() => { onPageChange('dashboard'); setProfileDropdownOpen(false); }}
                         className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-[#0F766E] transition-colors cursor-pointer flex items-center gap-2"
                       >
                         <LayoutDashboard className="w-3.5 h-3.5" /> Client Panel
                       </button>

                       <button
                         onClick={() => { setCurrentUser(null); setProfileDropdownOpen(false); onPageChange('shop'); }}
                         className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors cursor-pointer flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
                       >
                         <LogOut className="w-3.5 h-3.5" /> Terminate Session
                       </button>
                     </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => onPageChange('dashboard')}
              className="p-2 rounded-full hover:bg-white/10 text-white/90 hover:text-white cursor-pointer"
              title="Client Login"
            >
              <User className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
