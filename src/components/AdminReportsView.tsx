import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FileSpreadsheet, Download, RefreshCw, AlertTriangle, Printer, TrendingUp, DollarSign, Database, ShieldCheck } from 'lucide-react';

export const AdminReportsView: React.FC = () => {
  const {
    products,
    orders,
    customers,
    suppliers,
    settings,
    triggerToast,
    backupDatabase,
    restoreDatabase
  } = useApp();

  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'customer_supplier' | 'financials'>('sales');

  // Sales aggregates
  const todayStr = new Date().toISOString().substring(0, 10);
  const monthStr = new Date().toISOString().substring(0, 7);
  const yearStr = new Date().toISOString().substring(0, 4);

  const salesToday = orders.filter(o => o.date.startsWith(todayStr)).reduce((sum, o) => sum + o.grandTotal, 0);
  const salesMonth = orders.filter(o => o.date.startsWith(monthStr)).reduce((sum, o) => sum + o.grandTotal, 0);
  const salesYear = orders.filter(o => o.date.startsWith(yearStr)).reduce((sum, o) => sum + o.grandTotal, 0);
  const totalSalesVolume = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Profit margins compile
  const grossProfit = orders.reduce((sum, o) => {
    const cost = o.items.reduce((acc, item) => {
      const prod = products.find(p => p.id === item.productId);
      const buyPrice = prod ? prod.purchasePrice : item.finalPrice * 0.75;
      return acc + (buyPrice * item.quantity);
    }, 0);
    return sum + (o.grandTotal - cost - o.vatAmount - o.shippingCost);
  }, 0);

  // Inventory analysis
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.purchasePrice * p.stock), 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);

  // Backup handlers
  const handleBackup = () => {
    const data = backupDatabase();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(data);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `pharmaship_db_backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    triggerToast('Backup Completed', 'Full database schemas and catalogs archived to browser downloads.', 'success');
  };

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        const success = restoreDatabase(text);
        if (success) {
          triggerToast('Restore Successful', 'The B2B procurement database has been fully restored from JSON schema.', 'success');
        } else {
          triggerToast('Restore Failed', 'Invalid schema structure or backup file.', 'error');
        }
      }
    };
    fileReader.readAsText(file);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const exportCsv = (filename: string, rows: string[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSalesReport = () => {
    const headers = ["Order Number", "Date", "Customer Name", "Subtotal", "VAT Amount", "Grand Total", "Status"];
    const rows = orders.map(o => [
      o.orderNumber,
      o.date,
      o.customerDetails.name,
      o.items.reduce((sum, i) => sum + (i.finalPrice * i.quantity), 0).toString(),
      o.vatAmount.toString(),
      o.grandTotal.toString(),
      o.status
    ]);
    exportCsv("sales_requisition_report.csv", [headers, ...rows]);
    triggerToast('Report Exported', 'Sales requisition logs generated as CSV successfully.', 'success');
  };

  return (
    <div id="admin-reports-view" className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Side Selectors & Database Maintenance Controls */}
      <div className="flex flex-col gap-4 md:col-span-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col gap-1">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Select Report</h4>
          <button
            onClick={() => setReportType('sales')}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
              reportType === 'sales' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Sales Requisitions
          </button>
          <button
            onClick={() => setReportType('inventory')}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
              reportType === 'inventory' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Inventory Valuations
          </button>
          <button
            onClick={() => setReportType('customer_supplier')}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
              reportType === 'customer_supplier' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Wholesale Credit Balances
          </button>
          <button
            onClick={() => setReportType('financials')}
            className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
              reportType === 'financials' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Gross profit margins
          </button>
        </div>

        {/* DB Admin Tools */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Database className="w-4 h-4 text-teal-600" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Logistics DB Admin</h4>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Backup core tables (products, orders, customers, settings) or restore previous schemas.
          </p>

          <button
            onClick={handleBackup}
            className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            Backup Database (JSON)
          </button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              id="restore-file-input"
              onChange={handleRestore}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <button
              type="button"
              className="w-full py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
            >
              Restore Database (JSON)
            </button>
          </div>
        </div>
      </div>

      {/* Report Tables Display Sheet */}
      <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            {reportType === 'sales' && 'Sales Requisitions Sheet'}
            {reportType === 'inventory' && 'Therapeutics Inventory Value Log'}
            {reportType === 'customer_supplier' && 'Wholesale Credit & Ledger Accounts'}
            {reportType === 'financials' && 'Gross Financial margin Ledger'}
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-100 text-slate-600 dark:text-slate-400 cursor-pointer"
              title="Print Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
            {reportType === 'sales' && (
              <button
                onClick={handleExportSalesReport}
                className="py-1 px-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> CSV Report
              </button>
            )}
          </div>
        </div>

        {/* SALES REPORT SCREEN */}
        {reportType === 'sales' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Today's Wholesale Volume</span>
                <span className="text-lg font-black font-mono text-teal-600 mt-1 block">{settings.currency}{salesToday.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Monthly Requisitions</span>
                <span className="text-lg font-black font-mono text-teal-600 mt-1 block">{settings.currency}{salesMonth.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Annual Requisitions</span>
                <span className="text-lg font-black font-mono text-teal-600 mt-1 block">{settings.currency}{salesYear.toLocaleString()}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase text-[10px]">
                    <th className="py-2.5">Order</th>
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Buyer Clinic</th>
                    <th className="py-2.5 text-right">Items Value</th>
                    <th className="py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 font-mono font-bold text-slate-800 dark:text-slate-100">{o.orderNumber}</td>
                      <td className="py-2.5 text-slate-500">{o.date}</td>
                      <td className="py-2.5 font-bold">{o.customerDetails.name}</td>
                      <td className="py-2.5 text-right font-mono">{settings.currency}{o.grandTotal.toLocaleString()}</td>
                      <td className="py-2.5 text-center">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY REPORT SCREEN */}
        {reportType === 'inventory' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Wholesale Inventory Valuation (Cost)</span>
                <span className="text-lg font-black font-mono text-slate-800 dark:text-slate-100 mt-1 block">{settings.currency}{totalInventoryValue.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Safety Replenish Alarms</span>
                  <span className="text-lg font-black font-mono text-rose-500 mt-1 block">{lowStockItems.length} Products</span>
                </div>
                {lowStockItems.length > 0 && <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase text-[10px]">
                    <th className="py-2.5">Medication SKU</th>
                    <th className="py-2.5">Active Stock</th>
                    <th className="py-2.5 text-right">Cost Price</th>
                    <th className="py-2.5 text-right">Selling Price</th>
                    <th className="py-2.5 text-right">Total Value (Cost)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {products.map((p) => {
                    const isLow = p.stock <= p.minStock;
                    return (
                      <tr key={p.id}>
                        <td className="py-2.5">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{p.name}</span>
                          <span className="text-[9px] font-mono block text-slate-400">{p.sku}</span>
                        </td>
                        <td className="py-2.5 font-mono">
                          <span className={isLow ? 'text-rose-500 font-bold' : ''}>{p.stock}</span>
                          {isLow && <span className="text-[9px] text-rose-500 block italic">Replenish threshold {p.minStock}</span>}
                        </td>
                        <td className="py-2.5 text-right font-mono">{settings.currency}{p.purchasePrice}</td>
                        <td className="py-2.5 text-right font-mono">{settings.currency}{p.sellingPrice}</td>
                        <td className="py-2.5 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                          {settings.currency}{(p.purchasePrice * p.stock).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMER & SUPPLIER BALANCES SCREEN */}
        {reportType === 'customer_supplier' && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Outstanding Client Dues Receivable</span>
                <span className="text-lg font-black font-mono text-rose-500 mt-1 block">
                  {settings.currency}{customers.reduce((sum, c) => sum + c.dueAmount, 0).toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Corporate Supplier Dues Payable</span>
                <span className="text-lg font-black font-mono text-amber-600 mt-1 block">
                  {settings.currency}{suppliers.reduce((sum, s) => sum + s.dueAmount, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mt-2">Receivable Pharmacy Accounts</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase text-[10px]">
                    <th className="py-2.5">Pharmacy Business Name</th>
                    <th className="py-2.5">Phone Contact</th>
                    <th className="py-2.5 text-right">Lifetime Procurement</th>
                    <th className="py-2.5 text-right">Outstanding Receivable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 font-bold">{c.name}</td>
                      <td className="py-2.5 font-mono">{c.phone}</td>
                      <td className="py-2.5 text-right font-mono text-emerald-600 font-bold">{settings.currency}{c.totalPurchase.toLocaleString()}</td>
                      <td className="py-2.5 text-right font-mono text-rose-500 font-bold">{settings.currency}{c.dueAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FINANCIALS Profit Margins SCREEN */}
        {reportType === 'financials' && (
          <div className="flex flex-col gap-6 font-sans">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Cumulative Revenue</span>
                <span className="text-xl font-black font-mono text-slate-800 dark:text-slate-100 mt-1 block">{settings.currency}{totalSalesVolume.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-slate-850 rounded-xl">
                <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 block uppercase tracking-wider">Gross Trade Margins (Calculated Profit)</span>
                <span className="text-xl font-black font-mono text-teal-700 dark:text-teal-400 mt-1 block">{settings.currency}{grossProfit.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-normal">
                All values are calculated in real time using the formulas: <br />
                <code>Net Profit = Sum((Wholesale Item Price - original Supplier Cost) * quantity) - Coupon Discounts</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
