import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, Company, Supplier, Customer, Order, SystemSettings, Notification, OrderItem } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_COMPANIES,
  INITIAL_SUPPLIERS,
  INITIAL_CUSTOMERS,
  DEFAULT_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS
} from './mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  companies: Company[];
  suppliers: Supplier[];
  customers: Customer[];
  orders: Order[];
  settings: SystemSettings;
  notifications: Notification[];
  cart: { product: Product; quantity: number }[];
  wishlist: string[]; // Product IDs
  compareList: string[]; // Product IDs
  recentlyViewed: string[]; // Product IDs
  activeView: 'customer' | 'admin';
  adminLogged: boolean;
  currentUser: Customer | null;
  toasts: ToastMessage[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  bulkUploadProducts: (csvText: string) => void;
  exportProductsCsv: () => string;
  
  // Categories
  addCategory: (name: string) => void;
  editCategory: (id: string, name: string, status: 'active' | 'inactive') => void;
  deleteCategory: (id: string) => void;
  
  // Brands
  addBrand: (name: string) => void;
  editBrand: (id: string, name: string) => void;
  deleteBrand: (id: string) => void;

  // Companies
  addCompany: (name: string) => void;
  editCompany: (id: string, name: string) => void;
  deleteCompany: (id: string) => void;

  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'purchaseHistory'>) => void;
  editSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;

  // Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchase' | 'dueAmount'>) => void;
  editCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;

  // Orders
  placeOrder: (customerDetails: Order['customerDetails'], paymentMethod: Order['paymentMethod'], couponCode?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Settings
  updateSettings: (newSettings: SystemSettings) => void;
  backupData: () => string;
  restoreData: (jsonStr: string) => boolean;

  // Notifications
  addNotification: (title: string, message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  couponCode: string;
  applyCouponCode: (code: string) => boolean;

  // Wishlist, Compare, Recently Viewed
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  addToRecentlyViewed: (productId: string) => void;

  // View modes & Auth
  setViewMode: (view: 'customer' | 'admin') => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  setCurrentUser: (customer: Customer | null) => void;

  // Toast Utilities
  triggerToast: (title: string, message: string, type: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- STATE DECLARATIONS ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [activeView, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [adminLogged, setAdminLogged] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- INITIAL SEEDING FROM LOCALSTORAGE ---
  useEffect(() => {
    // Products
    const storedProducts = localStorage.getItem('ps_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('ps_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // Categories
    const storedCategories = localStorage.getItem('ps_categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('ps_categories', JSON.stringify(INITIAL_CATEGORIES));
    }

    // Brands
    const storedBrands = localStorage.getItem('ps_brands');
    if (storedBrands) {
      setBrands(JSON.parse(storedBrands));
    } else {
      setBrands(INITIAL_BRANDS);
      localStorage.setItem('ps_brands', JSON.stringify(INITIAL_BRANDS));
    }

    // Companies
    const storedCompanies = localStorage.getItem('ps_companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    } else {
      setCompanies(INITIAL_COMPANIES);
      localStorage.setItem('ps_companies', JSON.stringify(INITIAL_COMPANIES));
    }

    // Suppliers
    const storedSuppliers = localStorage.getItem('ps_suppliers');
    if (storedSuppliers) {
      setSuppliers(JSON.parse(storedSuppliers));
    } else {
      setSuppliers(INITIAL_SUPPLIERS);
      localStorage.setItem('ps_suppliers', JSON.stringify(INITIAL_SUPPLIERS));
    }

    // Customers
    const storedCustomers = localStorage.getItem('ps_customers');
    if (storedCustomers) {
      const parsed = JSON.parse(storedCustomers);
      setCustomers(parsed);
      // Log in the first customer by default so they can explore customer dashboard instantly
      if (parsed.length > 0) setCurrentUser(parsed[0]);
    } else {
      setCustomers(INITIAL_CUSTOMERS);
      localStorage.setItem('ps_customers', JSON.stringify(INITIAL_CUSTOMERS));
      if (INITIAL_CUSTOMERS.length > 0) setCurrentUser(INITIAL_CUSTOMERS[0]);
    }

    // Orders
    const storedOrders = localStorage.getItem('ps_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders(INITIAL_ORDERS as any);
      localStorage.setItem('ps_orders', JSON.stringify(INITIAL_ORDERS));
    }

    // Settings
    const storedSettings = localStorage.getItem('ps_settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      setSettings(parsed);
    } else {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('ps_settings', JSON.stringify(DEFAULT_SETTINGS));
    }

    // Notifications
    const storedNotifications = localStorage.getItem('ps_notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem('ps_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }

    // Wishlist
    const storedWishlist = localStorage.getItem('ps_wishlist');
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

    // Cart
    const storedCart = localStorage.getItem('ps_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // --- PERSISTENCE SYNCHRONIZERS ---
  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('ps_products', JSON.stringify(updated));
  };

  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem('ps_categories', JSON.stringify(updated));
  };

  const saveBrands = (updated: Brand[]) => {
    setBrands(updated);
    localStorage.setItem('ps_brands', JSON.stringify(updated));
  };

  const saveCompanies = (updated: Company[]) => {
    setCompanies(updated);
    localStorage.setItem('ps_companies', JSON.stringify(updated));
  };

  const saveSuppliers = (updated: Supplier[]) => {
    setSuppliers(updated);
    localStorage.setItem('ps_suppliers', JSON.stringify(updated));
  };

  const saveCustomers = (updated: Customer[]) => {
    setCustomers(updated);
    localStorage.setItem('ps_customers', JSON.stringify(updated));
  };

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('ps_orders', JSON.stringify(updated));
  };

  const saveSettings = (updated: SystemSettings) => {
    setSettings(updated);
    localStorage.setItem('ps_settings', JSON.stringify(updated));
    // Apply light/dark class
    if (updated.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const saveNotifications = (updated: Notification[]) => {
    setNotifications(updated);
    localStorage.setItem('ps_notifications', JSON.stringify(updated));
  };

  const saveWishlist = (updated: string[]) => {
    setWishlist(updated);
    localStorage.setItem('ps_wishlist', JSON.stringify(updated));
  };

  const saveCart = (updated: { product: Product; quantity: number }[]) => {
    setCart(updated);
    localStorage.setItem('ps_cart', JSON.stringify(updated));
  };

  // Theme support on mount
  useEffect(() => {
    if (settings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.themeMode]);

  // --- TOAST UTILITIES ---
  const triggerToast = (title: string, message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- SYSTEM ACTIONS ---
  
  // Products
  const addProduct = (p: Omit<Product, 'id' | 'rating' | 'reviews'>) => {
    const newProduct: Product = {
      ...p,
      id: 'p-' + Date.now(),
      rating: 5.0,
      reviews: []
    };
    const updated = [...products, newProduct];
    saveProducts(updated);
    triggerToast('Product Added', `${newProduct.name} has been added successfully.`, 'success');
    addNotification('New Product Added', `Admin added a new product: ${newProduct.name} (${newProduct.strength})`, 'info');
  };

  const editProduct = (p: Product) => {
    const updated = products.map((item) => (item.id === p.id ? p : item));
    saveProducts(updated);
    triggerToast('Product Updated', `${p.name} updated successfully.`, 'success');

    // Trigger low stock checks after edit
    if (p.stock <= p.minStock) {
      addNotification('Low Stock Warning', `${p.name} stock (${p.stock}) is below safety threshold of ${p.minStock}.`, 'warning');
    }
  };

  const deleteProduct = (id: string) => {
    const productToDelete = products.find((p) => p.id === id);
    const updated = products.filter((item) => item.id !== id);
    saveProducts(updated);
    if (productToDelete) {
      triggerToast('Product Deleted', `${productToDelete.name} has been removed.`, 'error');
    }
  };

  const bulkUploadProducts = (csvText: string) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim() !== '');
      if (lines.length <= 1) throw new Error("Empty CSV or missing headers");
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const newProducts: Product[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length < headers.length) continue;

        // Simple column mapping helper
        const getValue = (field: string) => {
          const idx = headers.indexOf(field);
          return idx > -1 ? cols[idx] : '';
        };

        const name = getValue('name') || `Product ${Date.now() + i}`;
        const genericName = getValue('genericname') || 'Generic Name';
        const companyName = getValue('companyname') || 'Generic Pharma Ltd.';
        const brandName = getValue('brandname') || name.split(' ')[0];
        const categoryName = getValue('category') || 'Antibiotics & Antivirals';
        
        // Find or create category ID
        let category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        let catId = category?.id || 'cat-1';
        if (!category && categories.length > 0) {
          catId = categories[0].id;
        }

        const mrp = parseFloat(getValue('mrp')) || 10;
        const purchasePrice = parseFloat(getValue('purchaseprice')) || mrp * 0.7;
        const sellingPrice = parseFloat(getValue('sellingprice')) || mrp * 0.95;
        const discount = parseFloat(getValue('discount')) || 0;
        const stock = parseInt(getValue('stock')) || 1000;
        const minStock = parseInt(getValue('minstock')) || 200;
        const sku = getValue('sku') || `SKU-${Date.now()}-${i}`;
        const barcode = getValue('barcode') || `BC-${Math.floor(Math.random() * 10000000000)}`;
        const strength = getValue('strength') || '500mg';
        const packSize = getValue('packsize') || '10x10 Tablets';
        const mode = (getValue('mode') || 'open') as Product['mode'];

        newProducts.push({
          id: `p-bulk-${Date.now()}-${i}`,
          name,
          genericName,
          companyName,
          brandName,
          categoryId: catId,
          mrp,
          purchasePrice,
          sellingPrice,
          discount,
          stock,
          minStock,
          status: 'active',
          mode: ['open', 'stock', 'preorder'].includes(mode) ? mode : 'open',
          barcode,
          sku,
          description: getValue('description') || `${name} is a high quality medicine produced under strict pharmaceutical guidelines.`,
          strength,
          packSize,
          rating: 5.0,
          images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
          reviews: []
        });
      }

      if (newProducts.length > 0) {
        const merged = [...products, ...newProducts];
        saveProducts(merged);
        triggerToast('Bulk Upload Success', `Imported ${newProducts.length} products successfully.`, 'success');
        addNotification('Bulk Import Completed', `Successfully uploaded ${newProducts.length} items via CSV.`, 'success');
      } else {
        throw new Error("No valid records found in CSV.");
      }
    } catch (err: any) {
      triggerToast('Import Failed', err.message || 'Please verify your CSV format.', 'error');
    }
  };

  const exportProductsCsv = () => {
    const headers = ['Name', 'GenericName', 'CompanyName', 'BrandName', 'MRP', 'PurchasePrice', 'SellingPrice', 'Discount', 'Stock', 'MinStock', 'SKU', 'Barcode', 'Strength', 'PackSize', 'Mode', 'Description'];
    const csvRows = [headers.join(',')];
    
    products.forEach((p) => {
      const row = [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.genericName.replace(/"/g, '""')}"`,
        `"${p.companyName.replace(/"/g, '""')}"`,
        `"${p.brandName.replace(/"/g, '""')}"`,
        p.mrp,
        p.purchasePrice,
        p.sellingPrice,
        p.discount,
        p.stock,
        p.minStock,
        `"${p.sku}"`,
        `"${p.barcode}"`,
        `"${p.strength}"`,
        `"${p.packSize}"`,
        p.mode,
        `"${p.description.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  };

  // Categories
  const addCategory = (name: string) => {
    const id = 'cat-' + Date.now();
    const updated = [...categories, { id, name, status: 'active' }];
    saveCategories(updated);
    triggerToast('Category Added', `Category "${name}" created.`, 'success');
  };

  const editCategory = (id: string, name: string, status: 'active' | 'inactive') => {
    const updated = categories.map(c => c.id === id ? { ...c, name, status } : c);
    saveCategories(updated);
    triggerToast('Category Updated', `Category saved successfully.`, 'success');
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id);
    saveCategories(updated);
    triggerToast('Category Removed', 'Category deleted.', 'error');
  };

  // Brands
  const addBrand = (name: string) => {
    const id = 'b-' + Date.now();
    const updated = [...brands, { id, name }];
    saveBrands(updated);
    triggerToast('Brand Added', `Brand "${name}" created.`, 'success');
  };

  const editBrand = (id: string, name: string) => {
    const updated = brands.map(b => b.id === id ? { ...b, name } : b);
    saveBrands(updated);
    triggerToast('Brand Updated', 'Brand updated.', 'success');
  };

  const deleteBrand = (id: string) => {
    const updated = brands.filter(b => b.id !== id);
    saveBrands(updated);
    triggerToast('Brand Deleted', 'Brand removed.', 'error');
  };

  // Companies
  const addCompany = (name: string) => {
    const id = 'c-' + Date.now();
    const updated = [...companies, { id, name }];
    saveCompanies(updated);
    triggerToast('Company Added', `Manufacturer "${name}" registered.`, 'success');
  };

  const editCompany = (id: string, name: string) => {
    const updated = companies.map(c => c.id === id ? { ...c, name } : c);
    saveCompanies(updated);
    triggerToast('Company Updated', 'Company details saved.', 'success');
  };

  const deleteCompany = (id: string) => {
    const updated = companies.filter(c => c.id !== id);
    saveCompanies(updated);
    triggerToast('Company Deleted', 'Manufacturer removed.', 'error');
  };

  // Suppliers
  const addSupplier = (s: Omit<Supplier, 'id' | 'purchaseHistory'>) => {
    const newSup: Supplier = {
      ...s,
      id: 'sup-' + Date.now(),
      purchaseHistory: []
    };
    const updated = [...suppliers, newSup];
    saveSuppliers(updated);
    triggerToast('Supplier Added', `${s.name} has been registered.`, 'success');
  };

  const editSupplier = (s: Supplier) => {
    const updated = suppliers.map(item => item.id === s.id ? s : item);
    saveSuppliers(updated);
    triggerToast('Supplier Saved', 'Supplier details updated.', 'success');
  };

  const deleteSupplier = (id: string) => {
    const updated = suppliers.filter(s => s.id !== id);
    saveSuppliers(updated);
    triggerToast('Supplier Deleted', 'Supplier registration deleted.', 'error');
  };

  // Customers
  const addCustomer = (c: Omit<Customer, 'id' | 'totalPurchase' | 'dueAmount'>) => {
    const newCust: Customer = {
      ...c,
      id: 'cust-' + Date.now(),
      totalPurchase: 0,
      dueAmount: 0
    };
    const updated = [...customers, newCust];
    saveCustomers(updated);
    triggerToast('Customer Added', `Account for ${c.name} created.`, 'success');
  };

  const editCustomer = (c: Customer) => {
    const updated = customers.map(item => item.id === c.id ? c : item);
    saveCustomers(updated);
    triggerToast('Customer Profile Saved', 'Customer details updated.', 'success');
    if (currentUser && currentUser.id === c.id) {
      setCurrentUser(c);
    }
  };

  const deleteCustomer = (id: string) => {
    const updated = customers.filter(c => c.id !== id);
    saveCustomers(updated);
    triggerToast('Customer Deleted', 'Customer registry removed.', 'error');
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = cart.find((item) => item.product.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updated = [...cart, { product, quantity }];
    }
    saveCart(updated);
    triggerToast('Added to Cart', `${product.name} (Qty: ${quantity}) has been added to your wholesale order.`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
    triggerToast('Removed from Cart', 'Item removed from purchase order.', 'info');
  };

  const clearCart = () => {
    saveCart([]);
    setCouponCode('');
  };

  const applyCouponCode = (code: string) => {
    if (code.toUpperCase() === 'WELCOME100') {
      setCouponCode('WELCOME100');
      triggerToast('Coupon Applied', '৳100 flat discount applied to your order!', 'success');
      return true;
    } else if (code.toUpperCase() === 'BULKPHARMA') {
      setCouponCode('BULKPHARMA');
      triggerToast('Coupon Applied', '3% extra discount applied to subtotal!', 'success');
      return true;
    }
    triggerToast('Invalid Coupon', 'This promo code does not exist or has expired.', 'error');
    return false;
  };

  // Orders
  const placeOrder = (details: Order['customerDetails'], paymentMethod: Order['paymentMethod'], coupon: string = '') => {
    // Math calculation
    const subtotal = cart.reduce((acc, item) => {
      const finalPrice = item.product.sellingPrice * (1 - item.product.discount / 100);
      return acc + finalPrice * item.quantity;
    }, 0);

    let couponDiscount = 0;
    const activeCoupon = coupon || couponCode;
    if (activeCoupon.toUpperCase() === 'WELCOME100') {
      couponDiscount = 100;
    } else if (activeCoupon.toUpperCase() === 'BULKPHARMA') {
      couponDiscount = subtotal * 0.03;
    }

    const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
    const vat = discountedSubtotal * (settings.vatPercent / 100);
    const shipping = subtotal > 15000 ? 0 : 350; // Free delivery for orders above ৳15,000
    const grandTotal = discountedSubtotal + vat + shipping;

    const orderNumber = `${settings.invoicePrefix}${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerDetails: details,
      items: cart.map((item) => {
        const finalPrice = Math.round(item.product.sellingPrice * (1 - item.product.discount / 100) * 100) / 100;
        return {
          productId: item.product.id,
          name: item.product.name,
          genericName: item.product.genericName,
          packSize: item.product.packSize,
          mrp: item.product.mrp,
          sellingPrice: item.product.sellingPrice,
          finalPrice,
          quantity: item.quantity
        };
      }),
      discountAmount: Math.round(couponDiscount * 100) / 100,
      couponCode: activeCoupon,
      vatAmount: Math.round(vat * 100) / 100,
      shippingCost: shipping,
      grandTotal: Math.round(grandTotal * 100) / 100,
      paymentMethod,
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
    };

    // Update product stocks & check thresholds
    const updatedProducts = products.map((prod) => {
      const ordered = cart.find((item) => item.product.id === prod.id);
      if (ordered) {
        const nextStock = Math.max(0, prod.stock - ordered.quantity);
        if (nextStock <= prod.minStock) {
          // Low stock warning
          setTimeout(() => {
            addNotification('Low Stock Alert', `${prod.name} has dropped below safety stock. Stock: ${nextStock}`, 'warning');
          }, 1000);
        }
        return { ...prod, stock: nextStock };
      }
      return prod;
    });

    saveProducts(updatedProducts);

    // Update customer statistics if they match
    const matchingCustomer = customers.find(c => c.name.toLowerCase() === details.name.toLowerCase() || c.phone === details.phone);
    if (matchingCustomer) {
      const updatedCustomers = customers.map(c => 
        c.id === matchingCustomer.id 
          ? { 
              ...c, 
              totalPurchase: c.totalPurchase + grandTotal,
              dueAmount: paymentMethod === 'Cash On Delivery' ? c.dueAmount + grandTotal : c.dueAmount
            } 
          : c
      );
      saveCustomers(updatedCustomers);
    }

    const nextOrders = [newOrder, ...orders];
    saveOrders(nextOrders);
    
    // Notify Admin
    addNotification('New Wholesale Order', `New order ${orderNumber} placed by ${details.name} for ৳${grandTotal.toLocaleString()}`, 'success');
    
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        addNotification('Order Status Updated', `Order ${o.orderNumber} is now marked as "${status.toUpperCase()}"`, 'info');
        return { ...o, status };
      }
      return o;
    });
    saveOrders(updated);
    triggerToast('Order Updated', `Order status set to ${status}.`, 'success');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    let nextWishlist;
    if (wishlist.includes(productId)) {
      nextWishlist = wishlist.filter(id => id !== productId);
      triggerToast('Removed Wishlist', 'Product removed from your watchlist.', 'info');
    } else {
      nextWishlist = [...wishlist, productId];
      const prod = products.find(p => p.id === productId);
      triggerToast('Added Wishlist', `${prod?.name || 'Product'} added to your wishlist.`, 'success');
    }
    saveWishlist(nextWishlist);
  };

  // Compare List (Max 3)
  const toggleCompare = (productId: string) => {
    if (compareList.includes(productId)) {
      setCompareList(prev => prev.filter(id => id !== productId));
      triggerToast('Removed Compare', 'Product removed from comparison grid.', 'info');
    } else {
      if (compareList.length >= 3) {
        triggerToast('Comparison Full', 'You can compare up to 3 products at a time.', 'warning');
        return;
      }
      setCompareList(prev => [...prev, productId]);
      const prod = products.find(p => p.id === productId);
      triggerToast('Added Compare', `${prod?.name} added to comparison.`, 'success');
    }
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // Recently Viewed (Max 5, Unique, Most recent first)
  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed(prev => {
      const clean = prev.filter(id => id !== productId);
      const next = [productId, ...clean].slice(0, 5);
      return next;
    });
  };

  // Settings & System backup/restore
  const updateSettings = (newSettings: SystemSettings) => {
    saveSettings(newSettings);
    triggerToast('Settings Saved', 'Platform configurations updated successfully.', 'success');
  };

  const backupData = () => {
    const backupObj = {
      products,
      categories,
      brands,
      companies,
      suppliers,
      customers,
      orders,
      settings,
      notifications,
      wishlist
    };
    return JSON.stringify(backupObj);
  };

  const restoreData = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.products) saveProducts(parsed.products);
      if (parsed.categories) saveCategories(parsed.categories);
      if (parsed.brands) saveBrands(parsed.brands);
      if (parsed.companies) saveCompanies(parsed.companies);
      if (parsed.suppliers) saveSuppliers(parsed.suppliers);
      if (parsed.customers) saveCustomers(parsed.customers);
      if (parsed.orders) saveOrders(parsed.orders);
      if (parsed.settings) saveSettings(parsed.settings);
      if (parsed.notifications) saveNotifications(parsed.notifications);
      if (parsed.wishlist) saveWishlist(parsed.wishlist);
      
      triggerToast('Restore Successful', 'All workspace tables and configurations successfully restored.', 'success');
      return true;
    } catch (e) {
      triggerToast('Restore Failed', 'Invalid database backup JSON provided.', 'error');
      return false;
    }
  };

  // Notifications
  const addNotification = (title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      title,
      message,
      type,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false
    };
    const updated = [newNotif, ...notifications];
    saveNotifications(updated);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    saveNotifications(updated);
  };

  const clearNotifications = () => {
    saveNotifications([]);
    triggerToast('Cleared Alerts', 'All notifications cleared.', 'info');
  };

  // Admin access
  const loginAdmin = (password: string): boolean => {
    if (password === '12345') {
      setAdminLogged(true);
      setViewMode('admin');
      triggerToast('Access Granted', 'Welcome to the PharmaShip Administrator Dashboard.', 'success');
      return true;
    }
    triggerToast('Access Denied', 'Invalid administrator credentials.', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setAdminLogged(false);
    setViewMode('customer');
    triggerToast('Logged Out', 'Administrator session terminated.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        brands,
        companies,
        suppliers,
        customers,
        orders,
        settings,
        notifications,
        cart,
        wishlist,
        compareList,
        recentlyViewed,
        activeView,
        adminLogged,
        currentUser,
        toasts,
        couponCode,
        searchQuery,
        setSearchQuery,
        
        addProduct,
        editProduct,
        deleteProduct,
        bulkUploadProducts,
        exportProductsCsv,
        
        addCategory,
        editCategory,
        deleteCategory,
        
        addBrand,
        editBrand,
        deleteBrand,

        addCompany,
        editCompany,
        deleteCompany,

        addSupplier,
        editSupplier,
        deleteSupplier,

        addCustomer,
        editCustomer,
        deleteCustomer,

        placeOrder,
        updateOrderStatus,

        updateSettings,
        backupData,
        restoreData,

        addNotification,
        markNotificationRead,
        clearNotifications,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,

        toggleWishlist,
        toggleCompare,
        clearCompare,
        addToRecentlyViewed,

        setViewMode,
        loginAdmin,
        logoutAdmin,
        setCurrentUser,

        triggerToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
