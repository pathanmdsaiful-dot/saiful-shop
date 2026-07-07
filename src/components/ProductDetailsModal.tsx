import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { useApp } from '../AppContext';
import { X, ShoppingCart, Heart, RefreshCw, Star, Barcode, Check, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onSelectProduct
}) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    categories,
    settings,
    products,
    editProduct
  } = useApp();

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(10); // Wholesale defaults to larger quantities
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  
  // Review form states
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Update active image if product changes
  useEffect(() => {
    setActiveImage(product.images[0]);
    setQuantity(10);
    setZoomStyle({});
  }, [product]);

  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const category = categories.find((c) => c.id === product.categoryId);

  const finalPrice = Math.round(product.sellingPrice * (1 - product.discount / 100) * 100) / 100;
  const totalCost = Math.round(finalPrice * quantity * 100) / 100;

  // Find similar products
  const similarProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  // Frequently bought together (take 2 other products)
  const frequentlyBought = products
    .filter((p) => p.id !== product.id && p.categoryId !== product.categoryId)
    .slice(0, 2);

  // Handle Review Submission
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      userName,
      rating,
      comment,
      date: new Date().toISOString().substring(0, 10)
    };

    const nextReviews = [newReview, ...(product.reviews || [])];
    const avgRating = Math.round((nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length) * 10) / 10;

    const updatedProduct = {
      ...product,
      reviews: nextReviews,
      rating: avgRating
    };

    editProduct(updatedProduct);
    setUserName('');
    setComment('');
  };

  // Image zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  return (
    <div id="product-details-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto flex flex-col border border-slate-100 dark:border-slate-800"
      >
        {/* Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:scale-105 transition-all cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Image Gallery & Previews */}
          <div className="flex flex-col gap-4">
            {/* Large Image with Zoom */}
            <div
              className="w-full h-80 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex items-center justify-center p-6 relative cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500'}
                alt={product.name}
                style={zoomStyle}
                className="max-h-full max-w-full object-contain transition-transform duration-100 ease-out"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-3 right-3 text-[10px] bg-black/50 text-white px-2 py-1 rounded font-medium">
                Hover to Zoom
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-lg border p-1 bg-white dark:bg-slate-950 cursor-pointer transition-all ${
                      activeImage === img
                        ? 'border-teal-600 ring-2 ring-teal-600/25'
                        : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications list */}
            <div className="mt-4 bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
                Technical Data Sheet
              </h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-mono">
                <div className="text-slate-500 dark:text-slate-400">Chemical Compound:</div>
                <div className="text-slate-800 dark:text-slate-200 text-right font-medium">{product.genericName}</div>

                <div className="text-slate-500 dark:text-slate-400">Strength Potency:</div>
                <div className="text-slate-800 dark:text-slate-200 text-right font-medium">{product.strength}</div>

                <div className="text-slate-500 dark:text-slate-400">Pack Format:</div>
                <div className="text-slate-800 dark:text-slate-200 text-right font-medium">{product.packSize}</div>

                <div className="text-slate-500 dark:text-slate-400">Manufacturer:</div>
                <div className="text-slate-800 dark:text-slate-200 text-right font-medium">{product.companyName}</div>

                <div className="text-slate-500 dark:text-slate-400">Global SKU Code:</div>
                <div className="text-slate-800 dark:text-slate-200 text-right font-medium">{product.sku}</div>

                <div className="text-slate-500 dark:text-slate-400">Universal Barcode:</div>
                <div className="text-slate-800 dark:text-slate-200 text-right font-medium flex items-center justify-end gap-1">
                  <Barcode className="w-3.5 h-3.5" /> {product.barcode}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Ordering Info & Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Manufacturer Name & Category */}
              <div className="flex items-center gap-2 text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1 uppercase tracking-wider">
                <span>{product.companyName}</span>
                <span>•</span>
                <span>{category?.name}</span>
              </div>

              {/* Title & Rating */}
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight mb-2">
                {product.name} ({product.strength})
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {product.rating} / 5.0
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({product.reviews?.length || 0} customer reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Price Details */}
              <div className="bg-teal-50/50 dark:bg-slate-950 rounded-xl p-4 border border-teal-100/30 dark:border-slate-800 flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Corporate Wholesale Price</span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl font-bold text-teal-700 dark:text-teal-400 font-mono">
                      {settings.currency}{finalPrice}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {settings.currency}{product.sellingPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-teal-600 font-medium">Exclusive corporate wholesale rate</span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Market retail rate (MRP)</span>
                  <div className="text-base font-semibold text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                    {settings.currency}{product.mrp}
                  </div>
                  <span className="text-[10px] text-rose-500 font-bold bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                    Save {Math.round(((product.mrp - finalPrice) / product.mrp) * 100)}%
                  </span>
                </div>
              </div>

              {/* Quantity Selector & Calculator */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Wholesale Quantity:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 overflow-hidden">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 5))}
                      className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-16 text-center text-sm font-semibold focus:outline-none bg-transparent font-mono dark:text-white"
                    />
                    <button
                      onClick={() => setQuantity(prev => prev + 5)}
                      className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Live total cost calculations */}
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Subtotal: <span className="text-slate-800 dark:text-slate-200 font-semibold">{settings.currency}{finalPrice}</span> x {quantity} = <span className="text-teal-600 dark:text-teal-400 font-bold">{settings.currency}{totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cart & Quick actions */}
            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0 && product.mode !== 'preorder'}
                className="flex-1 py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer active:scale-[0.99] disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.mode === 'preorder' ? 'Pre-Order Requisition' : 'Add to Purchase Order'}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer ${
                  isWishlisted ? 'text-rose-500 border-rose-200' : 'text-slate-400'
                }`}
              >
                <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => toggleCompare(product.id)}
                className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer ${
                  isCompared ? 'text-teal-600 border-teal-200' : 'text-slate-400'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ACCORDIONS: Frequently Bought Together & Reviews */}
        <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 & 2: Reviews */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">
                Client Reviews & Feedbacks
              </h3>
              
              {/* Review list */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {rev.userName}
                        </div>
                        <div className="text-[10px] text-slate-400">{rev.date}</div>
                      </div>
                      <div className="flex text-amber-500 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3" fill={i < rev.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No feedback registered yet. Be the first to review!</p>
                )}
              </div>
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleAddReview} className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Write Corporate Feedback
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Organization/Pharmacy Name"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 focus:outline-none dark:text-white"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">Rating:</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star className="w-4 h-4" fill={i < rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <textarea
                placeholder="Share your experience regarding margin efficacy, delivery timelines, or pack quality..."
                required
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-950 focus:outline-none dark:text-white w-full resize-none"
              />
              <button
                type="submit"
                className="self-end py-1.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Submit Feedback
              </button>
            </form>
          </div>

          {/* Col 3: Frequently Bought Together & Similar Products */}
          <div className="flex flex-col gap-6">
            {/* Frequently Bought */}
            {frequentlyBought.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  Frequently Bought Together
                </h3>
                <div className="space-y-3">
                  {frequentlyBought.map((fProd) => {
                    const fFinalPrice = Math.round(fProd.sellingPrice * (1 - fProd.discount / 100) * 100) / 100;
                    return (
                      <div
                        key={fProd.id}
                        onClick={() => onSelectProduct(fProd)}
                        className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-teal-500/50 hover:shadow-sm transition-all"
                      >
                        <img src={fProd.images[0]} alt="" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {fProd.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {settings.currency}{fFinalPrice} ({fProd.strength})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                  Similar therapeutic items
                </h3>
                <div className="space-y-3">
                  {similarProducts.map((sProd) => {
                    const sFinalPrice = Math.round(sProd.sellingPrice * (1 - sProd.discount / 100) * 100) / 100;
                    return (
                      <div
                        key={sProd.id}
                        onClick={() => onSelectProduct(sProd)}
                        className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-teal-500/50 hover:shadow-sm transition-all"
                      >
                        <img src={sProd.images[0]} alt="" className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {sProd.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {settings.currency}{sFinalPrice} ({sProd.strength})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
