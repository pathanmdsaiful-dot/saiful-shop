import React from 'react';
import { useApp } from '../AppContext';
import { TrendingUp, Package, Users, ShoppingCart, DollarSign, Activity, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    customers,
    orders,
    settings
  } = useApp();

  // --- STATS COMPILER ---
  const todayStr = new Date().toISOString().substring(0, 10);
  const currentMonthStr = new Date().toISOString().substring(0, 7);

  // Filter orders
  const todayOrders = orders.filter(o => o.date.startsWith(todayStr));
  const monthlyOrders = orders.filter(o => o.date.startsWith(currentMonthStr));
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  // Sales totals
  const todaySales = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const monthlySales = monthlyOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  // Low stock counter
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  // Profit calculation (Grand Total subtotal (based on sellingPrice) minus purchasePrice for each item)
  const totalProfit = orders.reduce((sum, o) => {
    const orderCost = o.items.reduce((cost, item) => {
      // Find original purchasePrice
      const prod = products.find(p => p.id === item.productId);
      const buyPrice = prod ? prod.purchasePrice : item.finalPrice * 0.7;
      return cost + (buyPrice * item.quantity);
    }, 0);
    // Approximate profit
    return sum + Math.max(0, o.grandTotal - orderCost - o.vatAmount - o.shippingCost);
  }, 0);

  // Top Selling Products (Compiled by quantity ordered)
  const topSellingList = React.useMemo(() => {
    const counts: { [id: string]: { name: string; qty: number; revenue: number; company: string } } = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        if (!counts[item.productId]) {
          counts[item.productId] = { name: item.name, qty: 0, revenue: 0, company: '' };
        }
        counts[item.productId].qty += item.quantity;
        counts[item.productId].revenue += item.finalPrice * item.quantity;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);
  }, [orders]);

  // Top Customer List (Sorted by total purchase volume)
  const topCustomerList = React.useMemo(() => {
    return [...customers]
      .sort((a, b) => b.totalPurchase - a.totalPurchase)
      .slice(0, 4);
  }, [customers]);

  // Chart data simulation (7 days line points)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekSales = [12000, 18500, 15000, 24000, 21000, 31000, todaySales];
  const weekOrders = [4, 6, 5, 8, 7, 9, todayOrders.length];

  const maxSale = Math.max(...weekSales, 1000);
  const maxOrder = Math.max(...weekOrders, 1);

  return (
    <div id="admin-dashboard-container" className="flex flex-col gap-6">
      {/* Cards KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sales KPI Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Today's Wholesale Sales</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {settings.currency}{todaySales.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.5% vs yesterday
            </span>
          </div>
        </div>

        {/* Monthly Sales */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Monthly Requisitions</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {settings.currency}{monthlySales.toLocaleString()}
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Active month: {currentMonthStr}</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Pending Orders</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {pendingOrders.length}
            </h3>
            <span className="text-[10px] text-amber-500 font-semibold mt-1 block">Requires dispatch review</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl ${lowStockProducts.length > 0 ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Low Stock Warnings</span>
            <h3 className={`text-xl font-extrabold font-mono mt-0.5 ${lowStockProducts.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800'}`}>
              {lowStockProducts.length}
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Below safety threshold</span>
          </div>
        </div>
      </div>

      {/* Cards KPI Grid 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Gross Profit Margin</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {settings.currency}{totalProfit.toLocaleString()}
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold block mt-1">Avg 18.2% trade margin</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Registered Clients</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {customers.length}
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Pharmacies & Clinics</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Therapeutic Catalog</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {products.length} Items
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Active drugs listings</span>
          </div>
        </div>

        {/* Cumulative Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Cumulative Revenue</span>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-0.5">
              {settings.currency}{totalRevenue.toLocaleString()}
            </h3>
            <span className="text-[10px] text-slate-400 mt-1 block">B2B life cycle turnover</span>
          </div>
        </div>
      </div>

      {/* Analytical Charts Row (Visual Graphs using SVGs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Trend Line Graph */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
            7-Day Wholesale Revenue Curve (৳)
          </h3>
          {/* Custom SVG Line Graph */}
          <div className="h-44 w-full relative flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f5f9" strokeWidth="0.5" />

              {/* Area Under line */}
              <path
                d={`M 0,100 
                    L 0,${100 - (weekSales[0] / maxSale) * 80} 
                    L 16,${100 - (weekSales[1] / maxSale) * 80} 
                    L 33,${100 - (weekSales[2] / maxSale) * 80} 
                    L 50,${100 - (weekSales[3] / maxSale) * 80} 
                    L 66,${100 - (weekSales[4] / maxSale) * 80} 
                    L 83,${100 - (weekSales[5] / maxSale) * 80} 
                    L 100,${100 - (weekSales[6] / maxSale) * 80} 
                    L 100,100 Z`}
                fill="url(#salesAreaGrad)"
                opacity="0.15"
              />

              {/* Core Line */}
              <path
                d={`M 0,${100 - (weekSales[0] / maxSale) * 80} 
                    L 16,${100 - (weekSales[1] / maxSale) * 80} 
                    L 33,${100 - (weekSales[2] / maxSale) * 80} 
                    L 50,${100 - (weekSales[3] / maxSale) * 80} 
                    L 66,${100 - (weekSales[4] / maxSale) * 80} 
                    L 83,${100 - (weekSales[5] / maxSale) * 80} 
                    L 100,${100 - (weekSales[6] / maxSale) * 80}`}
                fill="none"
                stroke="#0f766e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {weekSales.map((val, idx) => {
                const cx = (idx / 6) * 100;
                const cy = 100 - (val / maxSale) * 80;
                return (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r="2.5"
                    fill="#0f766e"
                    stroke="#ffffff"
                    strokeWidth="1"
                    className="hover:r-4 transition-all cursor-pointer"
                  >
                    <title>{days[idx]}: {settings.currency}{val.toLocaleString()}</title>
                  </circle>
                );
              })}

              <defs>
                <linearGradient id="salesAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f766e" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Labels Row */}
          <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-bold font-mono">
            {days.map((d, i) => (
              <span key={i} className="w-10 text-center">{d}</span>
            ))}
          </div>
        </div>

        {/* Order Graph (Weekly bar Representation) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
            7-Day Requisition Orders Load (Packs)
          </h3>
          <div className="h-44 w-full flex items-end justify-between gap-4">
            {weekOrders.map((ordersCount, idx) => {
              const barHeight = Math.max(12, (ordersCount / maxOrder) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                  <span className="text-[9px] font-bold text-slate-400 mb-1 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {ordersCount}
                  </span>
                  <div
                    style={{ height: `${barHeight}%` }}
                    className="w-full bg-teal-700/20 group-hover:bg-teal-700 rounded-t-md transition-colors"
                  />
                  <span className="text-[10px] text-slate-500 font-bold font-mono mt-2 block">{days[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top tables grid (Best selling medications & Best corporate clients) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top selling products */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
            Top-Selling wholesale medications
          </h3>
          {topSellingList.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6">No order items recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {topSellingList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-teal-100 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 font-black rounded-lg flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                      <span className="text-[10px] text-slate-400">Total units ordered: <strong>{item.qty}</strong></span>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-100">
                    {settings.currency}{item.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Customers (Top Pharmacy Clients) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
            Top Clinical & Pharmacy Accounts
          </h3>
          {topCustomerList.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-6">No active customers logged.</p>
          ) : (
            <div className="space-y-4">
              {topCustomerList.map((client, idx) => (
                <div key={client.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 font-black rounded-lg flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{client.name}</h4>
                      <span className="text-[10px] text-slate-400">Due limit: <strong className="text-rose-500">{settings.currency}{client.dueAmount.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-600">
                    {settings.currency}{client.totalPurchase.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
