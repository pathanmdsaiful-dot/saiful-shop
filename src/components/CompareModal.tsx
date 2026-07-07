import React from 'react';
import { useApp } from '../AppContext';
import { X, ShoppingCart, Percent, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CompareModalProps {
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ onClose }) => {
  const {
    compareList,
    toggleCompare,
    clearCompare,
    products,
    categories,
    addToCart,
    settings
  } = useApp();

  const comparedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <div id="compare-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-8 border border-slate-100 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Product Comparison Grid
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Compare chemical formulations, pricing structures, and margins side-by-side.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearCompare}
              className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-400 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {comparedProducts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No items added to comparison list.</p>
            <p className="text-xs text-slate-400 mt-1">Click the comparison icon on any product card to start.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border-spacing-0">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/4">Feature</th>
                  {comparedProducts.map(p => (
                    <th key={p.id} className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100 text-center relative group w-1/4">
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute top-1 right-1 p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-16 flex items-center justify-center mb-2">
                        <img src={p.images[0]} alt="" className="max-h-full max-w-[60px] object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <div className="truncate text-xs font-bold leading-tight">{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {/* Generic Name */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Generic Compound</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-mono italic">{p.genericName}</td>
                  ))}
                </tr>
                {/* Manufacturer */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Manufacturer</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-medium">{p.companyName}</td>
                  ))}
                </tr>
                {/* Potency Strength */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Potency Strength</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-mono font-medium">{p.strength}</td>
                  ))}
                </tr>
                {/* Pack Format */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Pack Format</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-mono">{p.packSize}</td>
                  ))}
                </tr>
                {/* Corporate WS Price */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Wholesale Price</td>
                  {comparedProducts.map(p => {
                    const finalPrice = Math.round(p.sellingPrice * (1 - p.discount / 100) * 100) / 100;
                    return (
                      <td key={p.id} className="py-2 px-4 text-center font-bold text-teal-600 dark:text-teal-400 font-mono text-sm">
                        {settings.currency}{finalPrice}
                      </td>
                    );
                  })}
                </tr>
                {/* Retail Price MRP */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Retail Price (MRP)</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-mono">{settings.currency}{p.mrp}</td>
                  ))}
                </tr>
                {/* Discount */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Discount Margin</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-medium">
                      {p.discount > 0 ? (
                        <span className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                          {p.discount}%
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Profit Margin */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Retail Profit Margin</td>
                  {comparedProducts.map(p => {
                    const finalPrice = Math.round(p.sellingPrice * (1 - p.discount / 100) * 100) / 100;
                    const margin = Math.round(((p.mrp - finalPrice) / p.mrp) * 100);
                    return (
                      <td key={p.id} className="py-2 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {margin}%
                      </td>
                    );
                  })}
                </tr>
                {/* Available Warehouse Stocks */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Warehouse Status</td>
                  {comparedProducts.map(p => {
                    const isLow = p.stock <= p.minStock;
                    const isOut = p.stock <= 0;
                    return (
                      <td key={p.id} className="py-2 px-4 text-center">
                        {isOut ? (
                          <span className="text-rose-500 font-bold">Out of Stock</span>
                        ) : isLow ? (
                          <span className="text-amber-500 font-medium">Low Stock ({p.stock})</span>
                        ) : (
                          <span className="text-emerald-500 font-medium">In Stock ({p.stock})</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                {/* Global SKU */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">Product SKU</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-mono">{p.sku}</td>
                  ))}
                </tr>
                {/* Barcode */}
                <tr>
                  <td className="py-2 px-4 font-semibold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20">EAN Barcode</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-2 px-4 text-center font-mono">{p.barcode}</td>
                  ))}
                </tr>
                {/* Add to order action */}
                <tr className="bg-slate-50/50 dark:bg-slate-950/10">
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Action</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="py-3 px-4 text-center">
                      <button
                        onClick={() => addToCart(p, 10)}
                        disabled={p.stock <= 0 && p.mode !== 'preorder'}
                        className="py-1.5 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-[10px] uppercase flex items-center justify-center gap-1.5 mx-auto transition-all cursor-pointer shadow-sm disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Buy 10
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};
