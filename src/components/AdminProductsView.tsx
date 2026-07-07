import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Product } from '../types';
import { Search, Plus, Edit3, Trash2, Download, Upload, AlertTriangle, X, Barcode, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminProductsView: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    editProduct,
    deleteProduct,
    bulkUploadProducts,
    exportProductsCsv,
    settings
  } = useApp();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');

  // Modal triggers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mrp, setMrp] = useState(10);
  const [purchasePrice, setPurchasePrice] = useState(7);
  const [sellingPrice, setSellingPrice] = useState(9);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(1000);
  const [minStock, setMinStock] = useState(200);
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [strength, setStrength] = useState('');
  const [packSize, setPackSize] = useState('');
  const [mode, setMode] = useState<Product['mode']>('open');
  const [imageUrl, setImageUrl] = useState('');

  const resetForm = () => {
    setName('');
    setGenericName('');
    setCompanyName('');
    setBrandName('');
    setCategoryId(categories[0]?.id || '');
    setMrp(10);
    setPurchasePrice(7);
    setSellingPrice(9);
    setDiscount(0);
    setStock(1000);
    setMinStock(200);
    setBarcode('');
    setSku('');
    setDescription('');
    setStrength('');
    setPackSize('');
    setMode('open');
    setImageUrl('');
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setGenericName(p.genericName);
    setCompanyName(p.companyName);
    setBrandName(p.brandName);
    setCategoryId(p.categoryId);
    setMrp(p.mrp);
    setPurchasePrice(p.purchasePrice);
    setSellingPrice(p.sellingPrice);
    setDiscount(p.discount);
    setStock(p.stock);
    setMinStock(p.minStock);
    setBarcode(p.barcode);
    setSku(p.sku);
    setDescription(p.description);
    setStrength(p.strength);
    setPackSize(p.packSize);
    setMode(p.mode);
    setImageUrl(p.images[0] || '');
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name,
      genericName,
      companyName,
      brandName,
      categoryId,
      mrp,
      purchasePrice,
      sellingPrice,
      discount,
      stock,
      minStock,
      status: 'active',
      mode,
      barcode: barcode || Math.floor(1000000000000 + Math.random() * 9000000000000).toString(),
      sku: sku || 'SKU-' + Date.now().toString().substring(8),
      description: description || 'Clinical drug formulation cataloged under PharmaShip standard wholesales catalog.',
      strength: strength || '500mg',
      packSize: packSize || '10x10 Box',
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400']
    });
    setIsAddOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    editProduct({
      ...editingProduct,
      name,
      genericName,
      companyName,
      brandName,
      categoryId,
      mrp,
      purchasePrice,
      sellingPrice,
      discount,
      stock,
      minStock,
      barcode,
      sku,
      description,
      strength,
      packSize,
      mode,
      images: imageUrl ? [imageUrl] : editingProduct.images
    });
    setEditingProduct(null);
  };

  const handleCsvExport = () => {
    const csv = exportProductsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'pharmaship_products_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkCsvText.trim()) return;
    bulkUploadProducts(bulkCsvText);
    setBulkCsvText('');
    setIsBulkOpen(false);
  };

  // Filters application
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.genericName.toLowerCase().includes(search.toLowerCase()) ||
      p.companyName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search);

    const matchCat = catFilter === 'all' || p.categoryId === catFilter;
    const matchMode = modeFilter === 'all' || p.mode === modeFilter;

    return matchSearch && matchCat && matchMode;
  });

  return (
    <div id="admin-products-view" className="flex flex-col gap-6">
      {/* Search Filter bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 px-3 py-2 w-full md:max-w-md h-10">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by SKU, Barcode, formula generic name..."
            className="text-xs bg-transparent focus:outline-none w-full dark:text-white"
          />
        </div>

        {/* Filters dropdown */}
        <div className="flex flex-wrap gap-2.5 items-center">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-lg dark:text-white"
          >
            <option value="all">All Therapeutics</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-lg dark:text-white"
          >
            <option value="all">All Modes</option>
            <option value="open">Open Mode</option>
            <option value="stock">Stock Mode</option>
            <option value="preorder">Pre Order Mode</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-10 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>

          <button
            onClick={() => setIsBulkOpen(true)}
            className="py-2 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5 h-10"
          >
            <Upload className="w-4 h-4" /> Bulk CSV
          </button>

          <button
            onClick={handleCsvExport}
            className="py-2 px-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5 h-10"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Grid List table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Medication</th>
                <th className="py-3 px-4">Formula</th>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4 text-center">Mode</th>
                <th className="py-3 px-4 text-right">Wholesale Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center italic text-slate-400">
                    No active medications match current filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const hasLowStock = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-8 h-8 object-contain bg-white rounded border" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-none">{p.name}</h4>
                          <span className="text-[10px] text-slate-400 block mt-1">{p.companyName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium truncate max-w-[150px]">{p.genericName}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-500 block">{p.sku}</span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-0.5"><Barcode className="w-3 h-3" /> {p.barcode}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          p.mode === 'open' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                          p.mode === 'preorder' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20' :
                          'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                        }`}>
                          {p.mode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-teal-600">
                        {settings.currency}{p.sellingPrice}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`font-mono font-bold ${hasLowStock ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                            {p.stock}
                          </span>
                          {hasLowStock && (
                            <span className="text-rose-500 animate-pulse" title="Low Stock Warn">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-400 block font-mono">Min: {p.minStock}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 text-slate-400 hover:text-teal-600 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove "${p.name}"?`)) deleteProduct(p.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT DIALOG */}
      <AnimatePresence>
        {(isAddOpen || editingProduct) && (
          <div id="product-dialog-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => { setIsAddOpen(false); setEditingProduct(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                {editingProduct ? `Modify Medication: ${editingProduct.name}` : 'Catalog New Medication'}
              </h3>

              <form onSubmit={editingProduct ? handleSaveEdit : handleSaveAdd} className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Medication Brand Name *</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    placeholder="e.g. Azithrocin 500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Generic Chemical Formula *</label>
                  <input
                    type="text" required value={genericName} onChange={(e) => setGenericName(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                    placeholder="e.g. Azithromycin"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Manufacturer Pharma *</label>
                  <input
                    type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    placeholder="e.g. Square Pharmaceuticals Ltd."
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Category Therapeutic Group *</label>
                  <select
                    value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg dark:text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Strength Potency *</label>
                  <input
                    type="text" required value={strength} onChange={(e) => setStrength(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    placeholder="e.g. 500mg, 10 IU/ml"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Pack Format *</label>
                  <input
                    type="text" required value={packSize} onChange={(e) => setPackSize(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    placeholder="e.g. 30 Tablets Bottle, 5x3ml Pens"
                  />
                </div>

                {/* PRICING */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Purchase Cost Price ({settings.currency}) *</label>
                  <input
                    type="number" required min="0.1" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Corporate Wholesales Selling Price ({settings.currency}) *</label>
                  <input
                    type="number" required min="0.1" step="0.01" value={sellingPrice} onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Trade Discount Percentage (%)</label>
                  <input
                    type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Market Retail Price MRP ({settings.currency}) *</label>
                  <input
                    type="number" required min="0.1" step="0.01" value={mrp} onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                {/* LOGISTICS */}
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Warehouse stock Quantity *</label>
                  <input
                    type="number" required min="0" value={stock} onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Minimum Stock Alarm Threshold *</label>
                  <input
                    type="number" required min="1" value={minStock} onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Universal Barcode (EAN)</label>
                  <input
                    type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                    placeholder="Leave blank to generate"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Product SKU Code</label>
                  <input
                    type="text" value={sku} onChange={(e) => setSku(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                    placeholder="Leave blank to generate"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Procurement Stock Mode</label>
                  <select
                    value={mode} onChange={(e) => setMode(e.target.value as any)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg dark:text-white"
                  >
                    <option value="open">Open Mode</option>
                    <option value="stock">Stock Mode</option>
                    <option value="preorder">Pre Order Mode</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Product Image URL</label>
                  <input
                    type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-slate-500">Therapeutic Indications / Description</label>
                  <textarea
                    rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white resize-none"
                    placeholder="Share warnings, drug interactions, indications or descriptions..."
                  />
                </div>

                <button
                  type="submit"
                  className="col-span-2 py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-center shadow-md cursor-pointer mt-2"
                >
                  Save Medication Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: BULK CSV COPY-PASTE */}
      <AnimatePresence>
        {isBulkOpen && (
          <div id="bulk-dialog-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 dark:border-slate-800 relative"
            >
              <button
                onClick={() => setIsBulkOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">
                Bulk CSV copy-Paste Importer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Paste raw CSV text structure here. The first line must represent comma-separated headers matching: <br />
                <code className="bg-slate-50 dark:bg-slate-950 p-1 rounded mt-1 font-mono text-[10px] block border border-slate-100 dark:border-slate-800">
                  Name, GenericName, CompanyName, MRP, PurchasePrice, SellingPrice, Stock, MinStock, SKU, Barcode, Strength, PackSize, Mode, Description
                </code>
              </p>

              <form onSubmit={handleBulkUpload} className="flex flex-col gap-3">
                <textarea
                  required
                  rows={8}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  className="p-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl focus:outline-none dark:text-white font-mono text-[10px] resize-none"
                  placeholder={`Name,GenericName,CompanyName,MRP,PurchasePrice,SellingPrice,Stock,MinStock,SKU,Barcode,Strength,PackSize,Mode,Description
Cef-3 Capsule,Cefixime Trihydrate,Acme Laboratories Ltd.,45,32,41,5000,800,AC-CEF-3,89099887766,400mg,2x10 Capsules,open,Cefixime formulation antibiotic...`}
                />

                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkOpen(false)}
                    className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                  >
                    Trigger Bulk Import
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
