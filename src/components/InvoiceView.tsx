import React, { useRef } from 'react';
import { Order } from '../types';
import { useApp } from '../AppContext';
import { Printer, Download, X, CheckSquare, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface InvoiceViewProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ order, onClose }) => {
  const { settings, triggerToast } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const subtotal = order.items.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0);

  const handlePrint = () => {
    const printContent = invoiceRef.current?.innerHTML;
    if (!printContent) return;

    // Create iframe or print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Popup Blocked', 'Please allow popups to print invoices.', 'warning');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order.orderNumber}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: white; }
            .invoice-box { max-width: 800px; margin: auto; }
            table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; font-size: 12px; }
            table th { background: #f8fafc; padding: 10px; font-weight: bold; border-bottom: 2px solid #e2e8f0; }
            table td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
            .text-right { text-align: right; }
            .font-mono { font-family: monospace; }
            .font-bold { font-weight: bold; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .gap-2 { gap: 8px; }
            .mt-8 { margin-top: 32px; }
            .mb-8 { margin-bottom: 32px; }
            .text-2xl { font-size: 24px; }
            .text-xs { font-size: 11px; }
            .text-slate-500 { color: #64748b; }
            .border-t-2 { border-top: 2px solid #cbd5e1; }
            .py-4 { padding-top: 16px; padding-bottom: 16px; }
            .logo { font-size: 20px; font-weight: 900; color: #0f766e; }
            .barcode { font-family: 'Libre Barcode 39', monospace; font-size: 32px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPdf = () => {
    // Mimics real PDF compile and trigger
    triggerToast('Download Started', `PDF file for Invoice ${order.orderNumber} is compiling...`, 'info');
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Invoice-${order.orderNumber}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast('Download Completed', 'Invoice details archived successfully as structured JSON data.', 'success');
    }, 1500);
  };

  const isPaid = order.paymentMethod !== 'Cash On Delivery' || order.status === 'delivered';

  return (
    <div id="invoice-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 md:p-8 border border-slate-100 dark:border-slate-800 flex flex-col"
      >
        {/* Actions Controls Row */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400 font-bold px-2.5 py-1 rounded text-xs">
              WS INVOICE
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Order Ref: {order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="py-1.5 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Main Box (Ready for print clone) */}
        <div ref={invoiceRef} className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-100 dark:border-slate-900 text-slate-800 dark:text-slate-200 shadow-inner overflow-y-auto max-h-[60vh] font-sans">
          {/* Brand Row */}
          <div className="flex justify-between items-start gap-4 mb-6 border-b border-slate-100 dark:border-slate-900 pb-4">
            <div>
              <div className="logo text-teal-700 font-black text-lg">{settings.companyName}</div>
              <p className="text-[10px] text-slate-500 mt-1 max-w-xs">{settings.address}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Ph: {settings.phone} | {settings.email}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-300">INVOICE</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{order.orderNumber}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Date: {order.date}</p>
              
              {/* Fake CSS/SVG Barcode representing wholesale scan */}
              <div className="inline-flex gap-0.5 h-7 mt-3 px-1.5 py-0.5 bg-white border border-slate-200 rounded justify-center items-center">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="bg-slate-900 h-full inline-block"
                    style={{ width: `${(i % 3 === 0 ? 2 : i % 5 === 0 ? 3 : 1)}px` }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono block text-slate-400 mt-1 uppercase">*{order.id.substring(4, 12)}*</span>
            </div>
          </div>

          {/* Client & Shipping Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs border-b border-slate-100 dark:border-slate-900 pb-4">
            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-[10px]">BILLED TO:</h4>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{order.customerDetails.name}</p>
              <p className="text-slate-500 mt-1">{order.customerDetails.address}</p>
              <p className="text-slate-500 mt-0.5">Area: {order.customerDetails.area}, {order.customerDetails.district}</p>
              <p className="text-slate-500 font-mono mt-0.5">Contact: {order.customerDetails.phone}</p>
              <p className="text-slate-500 font-mono mt-0.5">Email: {order.customerDetails.email}</p>
            </div>
            <div className="text-left md:text-right flex flex-col md:items-end">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-[10px]">DELIVERY METRICS:</h4>
              <p className="text-slate-600 dark:text-slate-300">Method: <strong>Cold-Chain Trucking</strong></p>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Payment Method: <strong>{order.paymentMethod}</strong></p>
              <p className="text-slate-600 dark:text-slate-300 mt-1">Est. Delivery Date: <strong>{order.estimatedDelivery}</strong></p>
              <div className="mt-2.5">
                {isPaid ? (
                  <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    Paid / Settled
                  </span>
                ) : (
                  <span className="bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    Pending / Cash due
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery notes if any */}
          {order.customerDetails.deliveryNote && (
            <div className="mb-6 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800/60 text-[11px] italic text-slate-600 dark:text-slate-400">
              <strong>Delivery Instruction Note:</strong> "{order.customerDetails.deliveryNote}"
            </div>
          )}

          {/* Product list Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900 font-bold text-slate-500">
                  <th className="py-2 px-3 w-10 text-center">#</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3">Pack Format</th>
                  <th className="py-2 px-3 text-right">WS Price</th>
                  <th className="py-2 px-3 text-center">Quantity</th>
                  <th className="py-2 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-750 dark:text-slate-350">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100">
                      {item.name}
                      <span className="text-[10px] font-normal font-mono block text-slate-400 italic">
                        Formula: {item.genericName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{item.packSize}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{settings.currency}{item.finalPrice}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {settings.currency}{(item.finalPrice * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Sheet */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 text-xs font-mono">
            {/* Signature fields */}
            <div className="w-full md:w-1/2 mt-6 md:mt-0 flex flex-col justify-end h-full">
              <div className="pt-12 border-t border-dashed border-slate-300 dark:border-slate-800 max-w-xs text-center">
                <p className="font-bold text-slate-700 dark:text-slate-400 text-[10px] uppercase tracking-wider">Authorized Warehouse Officer</p>
                <p className="text-[8px] text-slate-400 mt-1">PharmaShip Distribution Logistics Hub</p>
              </div>
            </div>

            {/* Calculations right panel */}
            <div className="w-full md:w-1/2 space-y-1.5 text-right font-mono text-slate-600 dark:text-slate-400">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-1.5">
                <span>Subtotal Value:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{settings.currency}{subtotal.toLocaleString()}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Trade Discount:</span>
                  <span>-{settings.currency}{order.discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>VAT ({settings.vatPercent}%):</span>
                <span>{settings.currency}{order.vatAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Freight Shipping:</span>
                <span>
                  {order.shippingCost === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `${settings.currency}${order.shippingCost}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-slate-800 dark:text-slate-100 border-t border-slate-100 dark:border-slate-900 pt-2 font-sans">
                <span>GRAND TOTAL:</span>
                <span className="text-teal-700 dark:text-teal-400 font-mono text-lg">
                  {settings.currency}{order.grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
