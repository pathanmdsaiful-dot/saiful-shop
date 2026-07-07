import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Category, Brand, Company, Supplier, Customer } from '../types';
import { Plus, Edit3, Trash2, ShieldAlert, CheckCircle, XCircle, Search, UserCheck, FileSpreadsheet } from 'lucide-react';

export const AdminOtherManagers: React.FC = () => {
  const {
    categories, addCategory, editCategory, deleteCategory,
    brands, addBrand, editBrand, deleteBrand,
    companies, addCompany, editCompany, deleteCompany,
    suppliers, addSupplier, editSupplier, deleteSupplier,
    customers, addCustomer, editCustomer, deleteCustomer,
    settings
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'categories' | 'brands' | 'companies' | 'suppliers' | 'customers'>('categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newCatName, setNewCatName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newCompName, setNewCompName] = useState('');

  // Supplier Form
  const [supName, setSupName] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supAddress, setSupAddress] = useState('');
  const [supDues, setSupDues] = useState(0);

  // Customer Form
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custArea, setCustArea] = useState('');
  const [custDistrict, setCustDistrict] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const resetForms = () => {
    setNewCatName('');
    setNewBrandName('');
    setNewCompName('');
    setSupName('');
    setSupPhone('');
    setSupAddress('');
    setSupDues(0);
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setCustAddress('');
    setCustArea('');
    setCustDistrict('');
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSubTab === 'categories' && newCatName.trim()) {
      addCategory(newCatName);
    } else if (activeSubTab === 'brands' && newBrandName.trim()) {
      addBrand(newBrandName);
    } else if (activeSubTab === 'companies' && newCompName.trim()) {
      addCompany(newCompName);
    } else if (activeSubTab === 'suppliers' && supName.trim()) {
      addSupplier({
        name: supName,
        phone: supPhone,
        address: supAddress,
        dueAmount: supDues
      });
    } else if (activeSubTab === 'customers' && custName.trim()) {
      addCustomer({
        name: custName,
        email: custEmail,
        phone: custPhone,
        address: custAddress,
        area: custArea,
        district: custDistrict,
        status: 'active'
      });
    }
    resetForms();
  };

  const handleEditInit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
    if (activeSubTab === 'categories') {
      setNewCatName(item.name);
    } else if (activeSubTab === 'brands') {
      setNewBrandName(item.name);
    } else if (activeSubTab === 'companies') {
      setNewCompName(item.name);
    } else if (activeSubTab === 'suppliers') {
      setSupName(item.name);
      setSupPhone(item.phone);
      setSupAddress(item.address);
      setSupDues(item.dueAmount);
    } else if (activeSubTab === 'customers') {
      setCustName(item.name);
      setCustEmail(item.email);
      setCustPhone(item.phone);
      setCustAddress(item.address);
      setCustArea(item.area);
      setCustDistrict(item.district);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (activeSubTab === 'categories') {
      editCategory(editingItem.id, newCatName, editingItem.status);
    } else if (activeSubTab === 'brands') {
      editBrand(editingItem.id, newBrandName);
    } else if (activeSubTab === 'companies') {
      editCompany(editingItem.id, newCompName);
    } else if (activeSubTab === 'suppliers') {
      editSupplier({
        ...editingItem,
        name: supName,
        phone: supPhone,
        address: supAddress,
        dueAmount: supDues
      });
    } else if (activeSubTab === 'customers') {
      editCustomer({
        ...editingItem,
        name: custName,
        email: custEmail,
        phone: custPhone,
        address: custAddress,
        area: custArea,
        district: custDistrict
      });
    }
    resetForms();
  };

  // Status Toggles
  const toggleCategoryStatus = (cat: Category) => {
    editCategory(cat.id, cat.name, cat.status === 'active' ? 'inactive' : 'active');
  };

  const toggleCustomerStatus = (c: Customer) => {
    editCustomer({
      ...c,
      status: c.status === 'active' ? 'inactive' : 'active'
    });
  };

  // Filters
  const searchFilter = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter(item =>
      (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.phone && item.phone.includes(searchQuery)) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div id="admin-entities-tab" className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Sub Tabs Selection */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col gap-1">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">B2B Directory</h4>
        <button
          onClick={() => { setActiveSubTab('categories'); resetForms(); }}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
            activeSubTab === 'categories' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Therapeutics Categories ({categories.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('brands'); resetForms(); }}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
            activeSubTab === 'brands' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Active Brands ({brands.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('companies'); resetForms(); }}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
            activeSubTab === 'companies' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Pharma Manufacturers ({companies.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('suppliers'); resetForms(); }}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
            activeSubTab === 'suppliers' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Raw Stock Suppliers ({suppliers.length})
        </button>
        <button
          onClick={() => { setActiveSubTab('customers'); resetForms(); }}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
            activeSubTab === 'customers' ? 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Wholesale Clients ({customers.length})
        </button>
      </div>

      {/* Main Entities Table */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        {/* Actions header and search */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 px-3 py-2 w-full max-w-sm h-10">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in directory...`}
              className="text-xs bg-transparent focus:outline-none w-full dark:text-white"
            />
          </div>

          <button
            onClick={() => { resetForms(); setIsFormOpen(true); }}
            className="py-2 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 h-10"
          >
            <Plus className="w-4 h-4" /> Create New Record
          </button>
        </div>

        {/* Dynamic Forms overlay */}
        {isFormOpen && (
          <div className="bg-white dark:bg-slate-900 border border-teal-600/30 dark:border-slate-800 p-5 rounded-2xl shadow-md">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
              {editingItem ? 'Edit Existing Record' : 'Register New Entity'}
            </h4>
            <form onSubmit={editingItem ? handleUpdate : handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              {/* Category, Brand, Company Form */}
              {(activeSubTab === 'categories' || activeSubTab === 'brands' || activeSubTab === 'companies') && (
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-slate-500">Name Designation *</label>
                  <input
                    type="text" required
                    value={
                      activeSubTab === 'categories' ? newCatName :
                      activeSubTab === 'brands' ? newBrandName : newCompName
                    }
                    onChange={(e) => {
                      if (activeSubTab === 'categories') setNewCatName(e.target.value);
                      else if (activeSubTab === 'brands') setNewBrandName(e.target.value);
                      else setNewCompName(e.target.value);
                    }}
                    className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    placeholder={`Enter generic name...`}
                  />
                </div>
              )}

              {/* Supplier Form */}
              {activeSubTab === 'suppliers' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Supplier Enterprise Name *</label>
                    <input
                      type="text" required value={supName} onChange={(e) => setSupName(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                      placeholder="e.g. Acme Pharma Distributors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Phone Hotline *</label>
                    <input
                      type="text" required value={supPhone} onChange={(e) => setSupPhone(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                      placeholder="Phone coordinates"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Outstanding Due Ledger ({settings.currency})</label>
                    <input
                      type="number" value={supDues} onChange={(e) => setSupDues(parseFloat(e.target.value) || 0)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Logistics Hub Address *</label>
                    <input
                      type="text" required value={supAddress} onChange={(e) => setSupAddress(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                      placeholder="Street hub location"
                    />
                  </div>
                </>
              )}

              {/* Customer Form */}
              {activeSubTab === 'customers' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Pharmacy / Clinic Name *</label>
                    <input
                      type="text" required value={custName} onChange={(e) => setCustName(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Corporate Email Address *</label>
                    <input
                      type="email" required value={custEmail} onChange={(e) => setCustEmail(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Phone contact *</label>
                    <input
                      type="text" required value={custPhone} onChange={(e) => setCustPhone(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Delivery Area</label>
                    <input
                      type="text" required value={custArea} onChange={(e) => setCustArea(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                      placeholder="e.g. Dhanmondi"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">District Region</label>
                    <input
                      type="text" required value={custDistrict} onChange={(e) => setCustDistrict(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                      placeholder="e.g. Dhaka"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-500">Clinical Street Address</label>
                    <input
                      type="text" required value={custAddress} onChange={(e) => setCustAddress(e.target.value)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-lg focus:outline-none dark:text-white"
                      placeholder="Street coordinate details"
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  type="button" onClick={resetForms}
                  className="py-1.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold cursor-pointer"
                >
                  {editingItem ? 'Save Updates' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dynamic Lists tables based on sub tab selection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Categories table */}
          {activeSubTab === 'categories' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {searchFilter(categories).map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3 px-4 font-bold">{cat.name}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleCategoryStatus(cat)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider cursor-pointer ${
                          cat.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/25'
                        }`}
                      >
                        {cat.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditInit(cat)} className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm(`Delete category?`)) deleteCategory(cat.id); }} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Brands table */}
          {activeSubTab === 'brands' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Brand Designation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {searchFilter(brands).map((br) => (
                  <tr key={br.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3 px-4 font-bold">{br.name}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditInit(br)} className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm(`Delete brand?`)) deleteBrand(br.id); }} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Companies table */}
          {activeSubTab === 'companies' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Pharma Corporate Manufacturer</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {searchFilter(companies).map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3 px-4 font-bold">{comp.name}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditInit(comp)} className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm(`Delete manufacturer?`)) deleteCompany(comp.id); }} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Suppliers table */}
          {activeSubTab === 'suppliers' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Supplier Enterprise</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Outstanding due</th>
                  <th className="py-3 px-4">Hub Coordinates</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {searchFilter(suppliers).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3.5 px-4 font-bold">{s.name}</td>
                    <td className="py-3.5 px-4 font-mono">{s.phone}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-500">{settings.currency}{s.dueAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{s.address}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditInit(s)} className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm(`Delete supplier registry?`)) deleteSupplier(s.id); }} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Customers Table */}
          {activeSubTab === 'customers' && (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Pharmacy Client</th>
                  <th className="py-3 px-4">Area / Region</th>
                  <th className="py-3 px-4 text-right">Outstanding Credit</th>
                  <th className="py-3 px-4 text-right">Total procured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {searchFilter(customers).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                    <td className="py-3.5 px-4">
                      <h4 className="font-bold text-slate-850 dark:text-slate-100">{c.name}</h4>
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{c.phone} | {c.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span>{c.area}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{c.district}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-500 font-bold">{settings.currency}{c.dueAmount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-600 font-bold">{settings.currency}{c.totalPurchase.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleCustomerStatus(c)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider cursor-pointer ${
                          c.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/20'
                        }`}
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditInit(c)} className="p-1 text-slate-400 hover:text-teal-600 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm(`Remove customer record?`)) deleteCustomer(c.id); }} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
