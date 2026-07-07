export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  genericName: string;
  companyName: string;
  brandName: string;
  categoryId: string;
  mrp: number;
  purchasePrice: number;
  sellingPrice: number;
  discount: number; // percentage, e.g. 10 for 10%
  stock: number;
  minStock: number;
  status: 'active' | 'inactive';
  mode: 'open' | 'stock' | 'preorder';
  barcode: string;
  sku: string;
  description: string;
  strength: string; // e.g. '500mg', '10mg'
  packSize: string; // e.g. '10x10 Tablets', '100ml Bottle'
  rating: number;
  images: string[];
  reviews: Review[];
  frequentlyBoughtWith?: string[]; // product IDs
}

export interface Category {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface Brand {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  dueAmount: number;
  purchaseHistory: {
    id: string;
    date: string;
    amount: number;
    itemsCount: number;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  district: string;
  status: 'active' | 'inactive';
  dueAmount: number;
  totalPurchase: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  genericName: string;
  packSize: string;
  mrp: number;
  sellingPrice: number;
  finalPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    area: string;
    district: string;
    deliveryNote?: string;
  };
  items: OrderItem[];
  discountAmount: number;
  couponCode?: string;
  vatAmount: number;
  shippingCost: number;
  grandTotal: number;
  paymentMethod: 'Cash On Delivery' | 'bKash' | 'Nagad' | 'Bank';
  status: 'pending' | 'accepted' | 'packed' | 'shipping' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
}

export interface SystemSettings {
  companyName: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  vatPercent: number;
  invoicePrefix: string;
  themeMode: 'light' | 'dark';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  isRead: boolean;
}
