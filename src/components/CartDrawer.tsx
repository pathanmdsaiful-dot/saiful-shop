import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, Percent, Check, ArrowLeft, Landmark, Coins, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { Order } from '../types';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose: () => void;
  onViewInvoice?: (order: Order) => void;
  onCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen = true, onClose, onViewInvoice, onCheckout }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    couponCode,
    applyCouponCode,
    settings,
    clearCart,
    currentUser,
    placeOrder,
    triggerToast
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingName, setShippingName] = useState(currentUser?.name || '');
  const [shippingEmail, setShippingEmail] = useState(currentUser?.email || '');
  const [shippingPhone, setShippingPhone] = useState(currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [shippingArea, setShippingArea] = useState(currentUser?.area || '');
  const [shippingDistrict, setShippingDistrict] = useState(currentUser?.district || 'Dhaka');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash On Delivery');

  useEffect(() => {
    if (currentUser) {
      setShippingName(currentUser.name);
      setShippingEmail(currentUser.email);
      setShippingPhone(currentUser.phone);
      setShippingAddress(currentUser.address || '');
      setShippingArea(currentUser.area || '');
      setShippingDistrict(currentUser.district || 'Dhaka');
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => {
    const finalPrice = item.product.sellingPrice * (1 - item.product.discount / 100);
    return acc + finalPrice * item.quantity;
  }, 0);

  let couponDiscount = 0;
  if (couponCode.toUpperCase() === 'WELCOME100') {
    couponDiscount = 100;
  } else if (couponCode.toUpperCase() === 'BULKPHARMA') {
    couponDiscount = subtotal * 0.03;
  }

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const vatAmount = discountedSubtotal * (settings.vatPercent / 100);
  const shippingCost = subtotal === 0 ? 0 : subtotal > 15000 ? 0 : 350;
  const grandTotal = discountedSubtotal + vatAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyCouponCode(promoInput);
    setPromoInput('');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingName.trim() || !shippingEmail.trim() || !shippingPhone.trim() || !shippingAddress.trim()) {
      triggerToast('Required Fields Missing', 'Please provide Name, Email, Phone, and Address to place your order.', 'warning');
      return;
    }

    const details = {
      name: shippingName,
      email: shippingEmail,
      phone: shippingPhone,
      address: shippingAddress,
      area: shippingArea,
      district: shippingDistrict,
      deliveryNote
    };

    const newOrder = placeOrder(details, paymentMethod);
    if (newOrder) {
      triggerToast('Order Placed Successfully', `Wholesale order ${newOrder.orderNumber} has been placed.`, 'success');
      if (onViewInvoice) {
        onViewInvoice(newOrder);
      } else if (onCheckout) {
        onCheckout();
      } else {
        onClose();
      }
    }
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="relative max-w-md w-full bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-100 dark:border-slate-800 z-10"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <ShoppingBag className="w-5 h-5 text-teal-600" />
            <span className="font-bold text-base">
              {isCheckingOut ? 'B2B Wholesale Checkout' : 'Corporate Order Cart'}
            </span>
            <span className="bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back navigation when in checkout mode */}
        {isCheckingOut && (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-teal-50/40 dark:bg-slate-900">
            <button
              onClick={() => setIsCheckingOut(false)}
              className="flex items-center gap-1 text-xs text-teal-700 dark:text-teal-400 hover:underline font-bold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Order List
            </button>
            <span className="text-[10px] text-slate-400 font-mono">STEP 2 OF 2</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!isCheckingOut ? (
            /* CART LIST VIEW */
            cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Your order cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Explore our catalog to stock antibiotics, analgesics, diabetes pens, and clinical essentials.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
                >
                  Start Stocking
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemFinalPrice = Math.round(item.product.sellingPrice * (1 - item.product.discount / 100) * 100) / 100;
                const rowTotal = Math.round(itemFinalPrice * item.quantity * 100) / 100;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs relative"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-center flex-shrink-0">
                      <img src={item.product.images[0]} alt="" className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                            title="Delete Item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.product.genericName}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1 bg-white dark:bg-slate-950 inline-block px-1.5 rounded border border-slate-100 dark:border-slate-800">
                          {item.product.packSize}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        {/* Qty Manager */}
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-950 overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 5)}
                            className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 5)}
                            className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Line pricing */}
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {settings.currency}{itemFinalPrice} each
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 font-mono">
                            {settings.currency}{rowTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* CHECKOUT FORM VIEW */
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="bg-teal-50/40 dark:bg-slate-900/60 p-3 rounded-xl border border-teal-100/40 dark:border-slate-800 text-xs">
                <p className="font-bold text-teal-800 dark:text-teal-400">Logistics & Supply Verification</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Please confirm institution billing and cold-chain delivery details.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Institution / Pharmacy Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Popular Hospital Pharmacy"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="pharmacy@hospital.com"
                    value={shippingEmail}
                    onChange={(e) => setShippingEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Drug License / Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Corporate Delivery Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Street details, ward, building name"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Area / Thana *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhanmondi"
                    value={shippingArea}
                    onChange={(e) => setShippingArea(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">District *</label>
                  <select
                    value={shippingDistrict}
                    onChange={(e) => setShippingDistrict(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Special Cold-Chain / Logistics Notes</label>
                <textarea
                  placeholder="e.g. Keep in cooler pack, call clinical department on arrival"
                  rows={2}
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 dark:text-white resize-none"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">B2B Settlement Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Cash On Delivery', label: 'COD (Cash/Invoice)', icon: Coins },
                    { id: 'Bank', label: 'Bank Transfer', icon: Landmark },
                    { id: 'bKash', label: 'bKash Wallet', icon: Wallet },
                    { id: 'Nagad', label: 'Nagad Wallet', icon: Wallet }
                  ].map((pay) => {
                    const Icon = pay.icon;
                    const isSelected = paymentMethod === pay.id;
                    return (
                      <button
                        key={pay.id}
                        type="button"
                        onClick={() => setPaymentMethod(pay.id as any)}
                        className={`p-2.5 border text-left rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 text-teal-800 dark:text-teal-400 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-xs'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[11px] truncate">{pay.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <input type="submit" id="hidden-submit" className="hidden" />
            </form>
          )}
        </div>

        {/* Footer calculations & checkout action */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-3">
            {/* Promo Codes (Only shown in cart view) */}
            {!isCheckingOut && (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMOCODE (WELCOME100, BULKPHARMA)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1"
                >
                  Apply
                </button>
              </form>
            )}

            {/* active Coupon Indicator */}
            {couponCode && (
              <div className="flex justify-between items-center text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 font-bold" /> Active Promo: <strong>{couponCode}</strong>
                </span>
                <span className="text-[10px] uppercase font-bold cursor-pointer hover:underline text-rose-500" onClick={clearCart}>
                  Remove
                </span>
              </div>
            )}

            {/* Cost Summary Sheet */}
            <div className="space-y-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex justify-between">
                <span>Wholesale Subtotal:</span>
                <span className="text-slate-800 dark:text-slate-100">{settings.currency}{subtotal.toLocaleString()}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-rose-500 dark:text-rose-400">
                  <span>Promo Discount:</span>
                  <span>-{settings.currency}{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Government VAT ({settings.vatPercent}%):</span>
                <span className="text-slate-800 dark:text-slate-100">{settings.currency}{vatAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Cold-Chain Delivery:</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE (Above ৳15k)</span>
                  ) : (
                    `${settings.currency}${shippingCost}`
                  )}
                </span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Grand Order Total:</span>
              <span className="font-bold text-lg text-teal-700 dark:text-teal-400 font-mono">
                {settings.currency}{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* Checkout CTA / Order Submission */}
            {!isCheckingOut ? (
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer"
              >
                Confirm Wholesale Checkout <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  const submitBtn = document.getElementById('hidden-submit');
                  if (submitBtn) submitBtn.click();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer animate-pulse"
              >
                Submit Wholesale Order <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

