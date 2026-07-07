import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import { CustomerHeader } from './components/CustomerHeader';
import { CustomerFooter } from './components/CustomerFooter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CompareModal } from './components/CompareModal';
import { CartDrawer } from './components/CartDrawer';
import { ToastNotification } from './components/ToastNotification';
import { CustomerDashboardView } from './components/CustomerDashboardView';
import { InvoiceView } from './components/InvoiceView';
import { AdminLayout } from './components/AdminLayout';
import { Product, Order } from './types';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCcw, Tag, Star, ArrowLeftRight, CheckCircle2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const {
    products,
    categories,
    settings,
    triggerToast,
    wishlist,
    currentUser
  } = useApp();

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activePage, setActivePage] = useState<'shop' | 'dashboard'>('shop');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'priceAsc' | 'priceDesc' | 'stock'>('name');

  // Modals / Overlay states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingOrderInvoice, setViewingOrderInvoice] = useState<Order | null>(null);

  // Recently Viewed tracker
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Promo Slider state
  const [promoIndex, setPromoIndex] = useState(0);
  const promoBanners = [
    {
      badge: "EXCLUSIVE WHOLESALE PROMO",
      title: "Monsoon Safety Stockpiling",
      desc: "Get an extra 5.5% trade discount on all clinical antibiotics & antiviral formulations. Apply coupon: B2BHEALTH",
      bg: "from-teal-900 via-teal-800 to-emerald-900"
    },
    {
      badge: "COLD-CHAIN COMPLIANCE",
      title: "Insulin & Vaccines Distribution",
      desc: "Direct delivery to your clinic using specialized temperature-tracked freezer vans. Zero temperature excursions guaranteed.",
      bg: "from-blue-950 via-teal-900 to-cyan-950"
    },
    {
      badge: "PARTNER BRAND FOCUS",
      title: "Acme Therapeutics Launch",
      desc: "Wholesales partner launches of generic formulation drugs. Bulk pre-orders are now fully operational.",
      bg: "from-teal-950 via-slate-900 to-teal-900"
    }
  ];

  // Rotate promo banner automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener for secret admin mode: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const next = !prev;
          triggerToast(
            next ? 'Admin Mode Activated' : 'Storefront Restored',
            next ? 'Switched to executive distribution dashboard.' : 'Returned to wholesale client catalog.',
            'info'
          );
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerToast]);

  // Track product clicks to add to Recently Viewed
  const handleProductClick = (p: Product) => {
    setSelectedProduct(p);
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter(id => id !== p.id);
      return [p.id, ...filtered].slice(0, 5);
    });
  };

  // Compile recently viewed products
  const recentlyViewedProducts = products.filter(p => recentlyViewedIds.includes(p.id));

  // Category filter trigger
  const handleCategorySelect = (id: string | null) => {
    setSelectedCategory(id);
    setActivePage('shop');
  };

  // Sort and filter store products
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Wishlist filter
    if (showOnlyWishlist) {
      result = result.filter(p => wishlist.includes(p.id));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.genericName.toLowerCase().includes(q) ||
          p.companyName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === 'stock') {
      result.sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  // If in admin mode, display admin dashboard wrapper
  if (isAdminMode) {
    return <AdminLayout onExitAdmin={() => setIsAdminMode(false)} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
      {/* Persistant Top Store Header */}
      <CustomerHeader
        onSearchChange={(q) => {
          setSearch(q);
          setShowOnlyWishlist(false);
        }}
        onCartOpen={() => setIsCartOpen(true)}
        onCompareOpen={() => setIsCompareOpen(true)}
        onPageChange={(page) => {
          setActivePage(page);
          setShowOnlyWishlist(false);
        }}
        activePage={activePage}
        selectedCategory={selectedCategory}
        onCategorySelect={(catId) => {
          setSelectedCategory(catId);
          setShowOnlyWishlist(false);
          setActivePage('shop');
        }}
        showOnlyWishlist={showOnlyWishlist}
        onToggleWishlistOnly={(show) => {
          setShowOnlyWishlist(show);
          setActivePage('shop');
          setSelectedCategory(null);
        }}
        onToggleAdmin={() => {
          setIsAdminMode(true);
          triggerToast('Admin Terminal', 'Authorized access to logistics console established.', 'success');
        }}
      />

      {/* Main viewport Container */}
      <main className="flex-1">
        {activePage === 'dashboard' ? (
          /* Buyer Portal Account Dashboard View */
          <CustomerDashboardView onViewInvoice={(order) => setViewingOrderInvoice(order)} />
        ) : (
          /* Standard Wholesale Storefront */
          <div className="flex flex-col gap-10">
            {/* Dynamic Auto-Scrolling Promo Slider */}
            <div className="w-full bg-teal-950 text-white relative overflow-hidden h-[340px] flex items-center">
              {/* Abs Grid Background Decors */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              <div className="max-w-7xl mx-auto px-4 w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                {/* Sliders description */}
                <div className="flex flex-col justify-center h-full max-w-xl">
                  <motion.span
                    key={`badge-${promoIndex}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-750 border border-teal-600/40 text-teal-300 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full w-fit uppercase"
                  >
                    {promoBanners[promoIndex].badge}
                  </motion.span>

                  <motion.h2
                    key={`title-${promoIndex}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-4xl font-extrabold tracking-tight mt-4 leading-tight"
                  >
                    {promoBanners[promoIndex].title}
                  </motion.h2>

                  <motion.p
                    key={`desc-${promoIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs md:text-sm text-teal-150 mt-3 leading-relaxed"
                  >
                    {promoBanners[promoIndex].desc}
                  </motion.p>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      Procure Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-teal-300 font-mono">* B2B terms apply</span>
                  </div>
                </div>

                {/* Abs right illust */}
                <div className="hidden md:flex justify-end items-center h-full relative">
                  <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-teal-800 to-emerald-800/20 blur-2xl absolute -right-10" />
                  <div className="border border-teal-800/40 p-6 rounded-2xl bg-teal-900/60 backdrop-blur-sm shadow-xl flex flex-col gap-3 relative z-10 max-w-xs">
                    <span className="text-teal-400"><ShieldCheck className="w-8 h-8" /></span>
                    <h4 className="font-bold text-sm">Clinical Assurance Verified</h4>
                    <p className="text-[11px] text-teal-200">
                      PharmaShip matches all World Health Organization (WHO) cold-chain protocols & Drug Administration requirements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slider dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {promoBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPromoIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      promoIndex === i ? 'bg-white px-3' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Core B2B Value Badges Section */}
            <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner flex items-start gap-3.5">
                <span className="text-teal-700 bg-teal-50 dark:bg-teal-950 p-2 rounded-xl mt-1"><ShieldCheck className="w-5 h-5" /></span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">100% Genuine Clinicals</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Direct pharmaceutical factory sourcing contracts.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner flex items-start gap-3.5">
                <span className="text-teal-700 bg-teal-50 dark:bg-teal-950 p-2 rounded-xl mt-1"><Truck className="w-5 h-5" /></span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">Cold-Chain logistics</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Freezer van delivery maintaining standard potency parameters.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner flex items-start gap-3.5">
                <span className="text-teal-700 bg-teal-50 dark:bg-teal-950 p-2 rounded-xl mt-1"><RefreshCcw className="w-5 h-5" /></span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">Short expiry return policy</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Seamless replacement or credit adjustments within 180 days.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner flex items-start gap-3.5">
                <span className="text-teal-700 bg-teal-50 dark:bg-teal-950 p-2 rounded-xl mt-1"><Tag className="w-5 h-5" /></span>
                <div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">B2B Corporate Credit</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Net 30/60 corporate accounts for licensed pharmacies.</p>
                </div>
              </div>
            </div>

            {/* Therapeutics Category Slider Strip */}
            <div className="max-w-7xl mx-auto px-4 w-full">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-5">
                Shop by Therapeutic Indications
              </h3>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`py-2 px-5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                    selectedCategory === null
                      ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  All Therapeutic Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`py-2 px-5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Main store view: Filters sidebar & Product grid */}
            <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Filters Rail */}
              <div className="lg:col-span-1 flex flex-col gap-5 self-start">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-5 rounded-2xl shadow-inner">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-3">Sort Medications</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl focus:outline-none dark:text-white"
                  >
                    <option value="name">Chemical Name A-Z</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                    <option value="stock">High Stock First</option>
                  </select>
                </div>

                {/* Hot promos block */}
                <div className="bg-gradient-to-br from-teal-850 to-teal-950 p-5 rounded-2xl text-white shadow-md flex flex-col gap-3">
                  <span className="text-[10px] bg-teal-750 border border-teal-600/30 text-teal-300 py-1 px-2.5 rounded-full w-fit font-bold uppercase tracking-wider">Active Coupon</span>
                  <h4 className="font-extrabold text-sm tracking-tight">Bulk Clinic Pack Discount</h4>
                  <p className="text-[11px] text-teal-200 leading-normal">
                    Enter coupon <strong className="text-teal-300 bg-teal-900 px-1.5 py-0.5 rounded font-mono">PHARMA10</strong> during checkout to save an additional ৳1,000 on order values above ৳15,000.
                  </p>
                </div>
              </div>

              {/* Right Products grid */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                <div className="flex justify-between items-center text-xs">
                  <p className="text-slate-500 font-medium">
                    Showing <strong className="text-slate-800 dark:text-slate-200">{filteredProducts.length}</strong> wholesale listings
                  </p>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-850">
                    <h4 className="text-sm font-bold text-slate-850">No drugs listed</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      No therapeutic listings match "{search}". Try searching for generic formula names instead.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onQuickView={handleProductClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RECENTLY VIEWED STRIP */}
            {recentlyViewedProducts.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900/40 py-8 border-t border-b border-slate-100 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-5">
                    Recently Visited Formulations
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {recentlyViewedProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleProductClick(p)}
                        className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs cursor-pointer hover:border-teal-500 transition-all flex items-center gap-3"
                      >
                        <img src={p.images[0]} alt="" className="w-10 h-10 object-contain rounded bg-white" referrerPolicy="no-referrer" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">{p.name}</h4>
                          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{settings.currency}{p.sellingPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BRANDS / PARTNERS CAROUSEL */}
            <div className="max-w-7xl mx-auto px-4 w-full">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
                Active clinical distribution partnerships
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center items-center">
                {["Acme Labs", "Square Pharma", "Beximco", "Incepta", "Opsonin", "Popular"].map((b, i) => (
                  <div key={i} className="py-4 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl hover:shadow-xs transition-shadow">
                    <span className="font-extrabold text-sm text-slate-600 dark:text-slate-400 uppercase tracking-wide">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CLIENT CLINICS AND PHARMACIES FEEDBACK */}
            <div className="max-w-7xl mx-auto px-4 w-full py-4 border-t border-slate-100 dark:border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-xs">
                <div className="flex gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  "PharmaShip cold-chain delivery has been flawless for our insulin supplies. Highly recommended wholesale partners!"
                </p>
                <div className="mt-4">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Dr. Mominul Islam</h5>
                  <span className="text-[10px] text-slate-400">Chief Pharmacist, Labaid Clinic</span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-xs">
                <div className="flex gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  "Wholesale credit settlement options are perfectly structured. We use the Net-30 credit lines to keep our shelves stocked."
                </p>
                <div className="mt-4">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Farhana Yasmin</h5>
                  <span className="text-[10px] text-slate-400">Managing Director, Green Pharmacy</span>
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl shadow-xs">
                <div className="flex gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                  "CSV bulk uploads on the admin screen saved our team hours of manual stock updating. Pure operational craft."
                </p>
                <div className="mt-4">
                  <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">Adnan Chowdhury</h5>
                  <span className="text-[10px] text-slate-400">Procurement Officer, Popular Hospital</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Customer Footer */}
      <CustomerFooter
        onPageChange={setActivePage}
        onOpenAdminLogin={() => {
          setIsAdminMode(true);
          triggerToast('Admin Terminal', 'Authorized access to logistics console established.', 'success');
        }}
      />

      {/* ACTIVE MODALS & SIDE PANELS OVERLAYS */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {isCompareOpen && (
          <CompareModal
            onClose={() => setIsCompareOpen(false)}
          />
        )}

        {isCartOpen && (
          <CartDrawer
            onClose={() => setIsCartOpen(false)}
            onViewInvoice={(order) => {
              setIsCartOpen(false);
              setViewingOrderInvoice(order);
            }}
          />
        )}

        {viewingOrderInvoice && (
          <InvoiceView
            order={viewingOrderInvoice}
            onClose={() => setViewingOrderInvoice(null)}
          />
        )}
      </AnimatePresence>

      {/* Central Toasts Display Panel */}
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
