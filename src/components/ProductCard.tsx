import React from 'react';
import { Product } from '../types';
import { useApp } from '../AppContext';
import { ShoppingCart, Heart, RefreshCw, Eye, Percent, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    categories,
    settings
  } = useApp();

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const category = categories.find(c => c.id === product.categoryId);

  // Price calculations
  const finalPrice = Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100;
  const marginPercentage = Math.round(((product.mrp - finalPrice) / product.mrp) * 100);

  const getStockStatus = () => {
    if (product.stock <= 0) {
      return { label: 'Out of Stock', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' };
    }
    if (product.mode === 'preorder') {
      return { label: 'Pre-Order Only', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' };
    }
    if (product.stock <= product.minStock) {
      return { label: `Low Stock (${product.stock} units left)`, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' };
    }
    return { label: `In Stock (${product.stock} units)`, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' };
  };

  const stockStatus = getStockStatus();

  return (
    <motion.div
      id={`product-card-${product.id}`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 p-3 shadow-sm hover:shadow-md transition-all relative flex flex-col group h-full"
    >
      {/* Badge container */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {product.discount > 0 && (
          <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wider">
            <Percent className="w-2.5 h-2.5" /> {product.discount}% Off
          </span>
        )}
        {marginPercentage > 0 && (
          <span className="bg-[#0F766E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
            {marginPercentage}% Margin
          </span>
        )}
        {product.mode === 'preorder' && (
          <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-wider">
            <Clock className="w-2.5 h-2.5" /> Pre-Order
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`p-1.5 rounded-full shadow-xs bg-white dark:bg-slate-800 hover:scale-110 transition-all cursor-pointer ${
            isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => toggleCompare(product.id)}
          className={`p-1.5 rounded-full shadow-xs bg-white dark:bg-slate-800 hover:scale-110 transition-all cursor-pointer ${
            isCompared ? 'text-[#0F766E]' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          title="Compare Product"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image Area */}
      <div
        className="w-full h-40 bg-gray-50 dark:bg-slate-950 rounded-lg flex items-center justify-center p-3 relative cursor-pointer overflow-hidden flex-shrink-0 mb-3"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Company & Category */}
          <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-slate-500 tracking-wider">
            {product.companyName} • {category?.name || 'Medicine'}
          </p>

          {/* Product Name & Strength */}
          <h4
            className="font-bold text-gray-800 dark:text-slate-100 text-sm group-hover:text-[#14B8A6] transition-colors line-clamp-1 cursor-pointer"
            onClick={() => onQuickView(product)}
          >
            {product.name} <span className="text-xs font-normal text-slate-500">({product.strength})</span>
          </h4>

          {/* Generic Chemical Name */}
          <p className="text-[11px] italic text-gray-500 dark:text-slate-400 line-clamp-1 font-mono">
            {product.genericName}
          </p>

          {/* Stock Notification Bar & SKU info */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${stockStatus.color}`}>
              {stockStatus.label.split(' (')[0].toUpperCase()}
            </span>
            <span className="text-[9px] text-gray-400 dark:text-slate-500 font-mono">
              SKU: {product.sku}
            </span>
          </div>
        </div>

        {/* Pricing & Add To Cart */}
        <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through font-mono">
                {settings.currency}{product.sellingPrice}
              </span>
            )}
            <span className="text-lg font-extrabold text-[#0F766E] dark:text-[#14B8A6] font-mono leading-none">
              {settings.currency}{finalPrice}
            </span>
            <span className="text-[9px] text-gray-400 font-mono mt-0.5">
              MRP: {settings.currency}{product.mrp}
            </span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0 && product.mode !== 'preorder'}
            className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
              product.stock <= 0 && product.mode !== 'preorder'
                ? 'bg-gray-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-[#14B8A6] hover:bg-[#0F766E] text-white'
            }`}
            title={product.mode === 'preorder' ? 'Book Pre-Order' : 'Add to Order'}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
