import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Order } from '../types';
import { Search, Receipt, RefreshCw, Eye, Truck, Check, AlertCircle, Trash2 } from 'lucide-react';
import { InvoiceView } from './InvoiceView';

export const AdminOrdersView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    settings
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerDetails.name.toLowerCase().includes(search.toLowerCase()) ||
      o.customerDetails.phone.includes(search);

    const matchStatus = statusFilter === 'all' || o.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case 'accepted':
        return <span className="bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-400 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">Accepted</span>;
      case 'packed':
        return <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">Packed</span>;
      case 'shipping':
        return <span className="bg-teal-100 text-teal-800 dark:bg-teal-950/40 dark:text-teal-400 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">Shipping</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">Delivered</span>;
      default:
        return <span className="bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 py-1 px-2 rounded-full text-[10px] font-bold uppercase tracking-wider">Cancelled</span>;
    }
  };

  return (
    <div id="admin-orders-view" className="flex flex-col gap-6">
      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 px-3 py-2 w-full md:max-w-md h-10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, pharmacy phone, buyer name..."
            className="text-xs bg-transparent focus:outline-none w-full dark:text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-lg dark:text-white max-w-[180px] w-full"
        >
          <option value="all">All Queues</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="packed">Packed</option>
          <option value="shipping">Shipping</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grid Order table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Client Pharmacy</th>
                <th className="py-3 px-4">Logistics Details</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Order value</th>
                <th className="py-3 px-4 text-center">Dispatch Status Action</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center italic text-slate-400">
                    No active requisition orders recorded matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    {/* Order Reference */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">{o.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{o.date}</span>
                    </td>

                    {/* Client Pharmacy */}
                    <td className="py-3.5 px-4">
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs">{o.customerDetails.name}</h4>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{o.customerDetails.phone}</span>
                    </td>

                    {/* Logistics Address */}
                    <td className="py-3.5 px-4 max-w-[200px] truncate" title={`${o.customerDetails.address}, ${o.customerDetails.area}`}>
                      <span className="block truncate">{o.customerDetails.address}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{o.customerDetails.area}, {o.customerDetails.district}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(o.status)}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-100">
                      {settings.currency}{o.grandTotal.toLocaleString()}
                    </td>

                    {/* Dispatch Quick actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {o.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'accepted')}
                            className="py-1 px-2.5 bg-sky-650 hover:bg-sky-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Accept Order
                          </button>
                        )}
                        {o.status === 'accepted' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'packed')}
                            className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                          >
                            Pack Items
                          </button>
                        )}
                        {o.status === 'packed' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'shipping')}
                            className="py-1 px-2.5 bg-teal-750 hover:bg-teal-850 text-white rounded text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" /> Dispatch
                          </button>
                        )}
                        {o.status === 'shipping' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'delivered')}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        )}
                        {o.status !== 'delivered' && o.status !== 'cancelled' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'cancelled')}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                            title="Cancel Order"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}
                        {(o.status === 'delivered' || o.status === 'cancelled') && (
                          <span className="text-[10px] text-slate-400 italic">No action required</span>
                        )}
                      </div>
                    </td>

                    {/* Invoice generator */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setViewingInvoiceOrder(o)}
                        className="py-1 px-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 cursor-pointer flex items-center gap-1.5 ml-auto shadow-xs"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render Invoice Modal Overlay if selected */}
      {viewingInvoiceOrder && (
        <InvoiceView
          order={viewingInvoiceOrder}
          onClose={() => setViewingInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
