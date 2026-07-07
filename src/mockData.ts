import { Product, Category, Brand, Company, Supplier, Customer, SystemSettings, Notification } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Antibiotics & Antivirals', status: 'active' },
  { id: 'cat-2', name: 'Cardiovascular & Hypertension', status: 'active' },
  { id: 'cat-3', name: 'Gastrointestinal & Antacids', status: 'active' },
  { id: 'cat-4', name: 'Analgesics & Pain Relief', status: 'active' },
  { id: 'cat-5', name: 'Diabetes Care', status: 'active' },
  { id: 'cat-6', name: 'Respiratory & Asthma', status: 'active' },
  { id: 'cat-7', name: 'Vitamins & Supplements', status: 'active' }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b-1', name: 'Azithrocin' },
  { id: 'b-2', name: 'Napa Extend' },
  { id: 'b-3', name: 'Sergel' },
  { id: 'b-4', name: 'Bislol' },
  { id: 'b-5', name: 'Mixtard' },
  { id: 'b-6', name: 'Monas' },
  { id: 'b-7', name: 'Bextram Gold' }
];

export const INITIAL_COMPANIES: Company[] = [
  { id: 'c-1', name: 'Square Pharmaceuticals Ltd.' },
  { id: 'c-2', name: 'Beximco Pharmaceuticals Ltd.' },
  { id: 'c-3', name: 'Incepta Pharmaceuticals Ltd.' },
  { id: 'c-4', name: 'Renata Limited' },
  { id: 'c-5', name: 'Acme Laboratories Ltd.' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'MediGlobe Distributors',
    phone: '+8801711223344',
    address: 'Tejgaon Industrial Area, Dhaka',
    dueAmount: 45000,
    purchaseHistory: [
      { id: 'ph-1', date: '2026-06-15', amount: 150000, itemsCount: 12 },
      { id: 'ph-2', date: '2026-07-01', amount: 85000, itemsCount: 5 }
    ]
  },
  {
    id: 'sup-2',
    name: 'Apex Pharma Logistics',
    phone: '+8801819988776',
    address: 'Motijheel C/A, Dhaka',
    dueAmount: 12000,
    purchaseHistory: [
      { id: 'ph-3', date: '2026-06-20', amount: 62000, itemsCount: 4 }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Lazz Pharma Dhanmondi',
    email: 'lazz.dhanmondi@gmail.com',
    phone: '01711122233',
    address: 'House 45, Road 27, Dhanmondi',
    area: 'Dhanmondi',
    district: 'Dhaka',
    status: 'active',
    dueAmount: 5200,
    totalPurchase: 145000
  },
  {
    id: 'cust-2',
    name: 'Al-Madina Pharmacy',
    email: 'madina.pharma@yahoo.com',
    phone: '01822233344',
    address: '12 Stadium Market, Chittagong',
    area: 'Kotwali',
    district: 'Chittagong',
    status: 'active',
    dueAmount: 0,
    totalPurchase: 89000
  },
  {
    id: 'cust-3',
    name: 'Tamanna Pharmacy Uttara',
    email: 'tamanna.uttara@gmail.com',
    phone: '01933344455',
    address: 'Sector 3, Jashimuddin Avenue',
    area: 'Uttara',
    district: 'Dhaka',
    status: 'active',
    dueAmount: 1500,
    totalPurchase: 34000
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Azithrocin 500',
    genericName: 'Azithromycin',
    companyName: 'Square Pharmaceuticals Ltd.',
    brandName: 'Azithrocin',
    categoryId: 'cat-1',
    mrp: 35,
    purchasePrice: 24.5,
    sellingPrice: 30,
    discount: 5,
    stock: 2500,
    minStock: 500,
    status: 'active',
    mode: 'open',
    barcode: '8901111222333',
    sku: 'SQ-AZI-500',
    description: 'Azithromycin is a broad-spectrum macrolide antibiotic used to treat bacterial infections such as respiratory tract infections, skin infections, and certain sexually transmitted diseases.',
    strength: '500mg',
    packSize: '3x10 Tablets',
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'rev-1', userName: 'Lazz Pharma', rating: 5, comment: 'Excellent margin and consistent demand. Packaging is robust.', date: '2026-06-25' },
      { id: 'rev-2', userName: 'Tamanna Pharmacy', rating: 4, comment: 'High quality azithromycin, one of the top sellers in our shop.', date: '2026-07-02' }
    ]
  },
  {
    id: 'p-2',
    name: 'Sergel 20 Capsule',
    genericName: 'Esomeprazole Magnesium',
    companyName: 'Healthcare Pharmaceuticals Ltd.',
    brandName: 'Sergel',
    categoryId: 'cat-3',
    mrp: 7,
    purchasePrice: 5.2,
    sellingPrice: 6.2,
    discount: 10,
    stock: 15000,
    minStock: 2000,
    status: 'active',
    mode: 'open',
    barcode: '8902222333444',
    sku: 'HC-SER-20',
    description: 'Sergel is an esomeprazole magnesium capsule formulated to reduce gastric acid secretion. Indicated for GERD, gastric ulcers, and acid-related dyspepsia.',
    strength: '20mg',
    packSize: '10x10 Capsules',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1576071806251-447594958533?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'rev-3', userName: 'Al-Madina Pharma', rating: 5, comment: 'Fast delivery, long expiry date supplied. Customers specifically request Sergel.', date: '2026-06-20' }
    ]
  },
  {
    id: 'p-3',
    name: 'Napa Extend 665',
    genericName: 'Paracetamol',
    companyName: 'Beximco Pharmaceuticals Ltd.',
    brandName: 'NapaExtend',
    categoryId: 'cat-4',
    mrp: 2.5,
    purchasePrice: 1.8,
    sellingPrice: 2.2,
    discount: 0,
    stock: 35000,
    minStock: 5000,
    status: 'active',
    mode: 'open',
    barcode: '8903333444555',
    sku: 'BX-NAP-EXT',
    description: 'Napa Extend is a sustained-release formulation of paracetamol that provides effective, long-lasting relief from mild-to-moderate pain, backaches, joint pain, and fever.',
    strength: '665mg',
    packSize: '10x10 Tablets',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'rev-4', userName: 'Haji Drug House', rating: 5, comment: 'Standard essential medicine. Always in high stock.', date: '2026-07-04' }
    ]
  },
  {
    id: 'p-4',
    name: 'Bislol 5',
    genericName: 'Bisoprolol Fumarate',
    companyName: 'Incepta Pharmaceuticals Ltd.',
    brandName: 'Bislol',
    categoryId: 'cat-2',
    mrp: 10,
    purchasePrice: 7.2,
    sellingPrice: 8.8,
    discount: 8,
    stock: 450, // Low stock on purpose to trigger low stock alerts
    minStock: 500,
    status: 'active',
    mode: 'stock',
    barcode: '8904444555666',
    sku: 'IN-BIS-5',
    description: 'Bislol contains Bisoprolol Fumarate, a highly selective beta-1 blocker used in the treatment of hypertension, angina pectoris, and chronic stable heart failure.',
    strength: '5mg',
    packSize: '3x10 Tablets',
    rating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1512223792601-592a9809eed4?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: []
  },
  {
    id: 'p-5',
    name: 'Mixtard 30 FlexPen',
    genericName: 'Soluble Insulin + Isophane Insulin',
    companyName: 'Novo Nordisk (Renata)',
    brandName: 'Mixtard',
    categoryId: 'cat-5',
    mrp: 410,
    purchasePrice: 325,
    sellingPrice: 380,
    discount: 12,
    stock: 120,
    minStock: 50,
    status: 'active',
    mode: 'preorder', // Preorder example
    barcode: '8905555666777',
    sku: 'NN-MIX-FP',
    description: 'Mixtard 30 FlexPen is a pre-filled disposable pen containing a dual-acting premixed formulation of soluble insulin (30%) and isophane insulin (70%) for convenient diabetes control.',
    strength: '100 IU/ml',
    packSize: '5x3ml Pens',
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1607619275117-7d175d2e70a6?w=400&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1512223792601-592a9809eed4?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: [
      { id: 'rev-5', userName: 'Lazz Pharma', rating: 5, comment: 'We order cold-chain logistics regularly. Great product.', date: '2026-06-18' }
    ]
  },
  {
    id: 'p-6',
    name: 'Monas 10 Tablet',
    genericName: 'Montelukast Sodium',
    companyName: 'Acme Laboratories Ltd.',
    brandName: 'Monas',
    categoryId: 'cat-6',
    mrp: 16,
    purchasePrice: 11.5,
    sellingPrice: 14,
    discount: 6,
    stock: 8000,
    minStock: 1000,
    status: 'active',
    mode: 'open',
    barcode: '8906666777888',
    sku: 'AC-MON-10',
    description: 'Monas contains Montelukast, a leukotriene receptor antagonist. Indicated for the prophylaxis and chronic treatment of asthma and seasonal/perennial allergic rhinitis.',
    strength: '10mg',
    packSize: '3x10 Tablets',
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: []
  },
  {
    id: 'p-7',
    name: 'Bextram Gold Tablet',
    genericName: 'Multivitamin & Multimineral (A-Z)',
    companyName: 'Beximco Pharmaceuticals Ltd.',
    brandName: 'Bextram',
    categoryId: 'cat-7',
    mrp: 10,
    purchasePrice: 7.0,
    sellingPrice: 8.5,
    discount: 5,
    stock: 4500,
    minStock: 800,
    status: 'active',
    mode: 'open',
    barcode: '8907777888999',
    sku: 'BX-BEX-GLD',
    description: 'Bextram Gold is a comprehensive daily multivitamin and multimineral formulation designed to bridge nutritional gaps and support overall vitality, immune system, and physical fitness.',
    strength: 'Standard',
    packSize: '30 Tablets Bottle',
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?w=400&auto=format&fit=crop&q=60'
    ],
    reviews: []
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  companyName: 'PharmaShip Wholesale Corp.',
  logo: '🚢 PharmaShip',
  address: 'Level 14, Astra Biotech Tower, Kawran Bazar, Dhaka-1215, Bangladesh',
  phone: '+880 2-9876543',
  email: 'info@pharmaship.com',
  website: 'www.pharmaship.com',
  currency: '৳',
  vatPercent: 5,
  invoicePrefix: 'PS-2026-',
  themeMode: 'light'
};

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    title: 'Welcome to PharmaShip!',
    message: 'Your pharmacy wholesale workspace is successfully initialized. Enjoy corporate margins.',
    type: 'success',
    date: '2026-07-06 12:00',
    isRead: false
  },
  {
    id: 'n-2',
    title: 'Low Stock Alert: Bislol 5',
    message: 'Bislol 5 (IN-BIS-5) has dropped below its minimum stock threshold of 500 units. Current stock: 450.',
    type: 'warning',
    date: '2026-07-06 14:30',
    isRead: false
  },
  {
    id: 'n-3',
    title: 'Special Bulk Offer',
    message: 'Get an extra 2.5% trade discount on pre-ordered Mixtard 30 FlexPens this week.',
    type: 'info',
    date: '2026-07-06 15:10',
    isRead: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1',
    orderNumber: 'PS-2026-10001',
    date: '2026-07-05 10:15',
    customerDetails: {
      name: 'Lazz Pharma Dhanmondi',
      email: 'lazz.dhanmondi@gmail.com',
      phone: '01711122233',
      address: 'House 45, Road 27, Dhanmondi',
      area: 'Dhanmondi',
      district: 'Dhaka',
      deliveryNote: 'Deliver in air-conditioned van if possible'
    },
    items: [
      {
        productId: 'p-1',
        name: 'Azithrocin 500',
        genericName: 'Azithromycin',
        packSize: '3x10 Tablets',
        mrp: 35,
        sellingPrice: 30,
        finalPrice: 28.5,
        quantity: 100
      },
      {
        productId: 'p-2',
        name: 'Sergel 20 Capsule',
        genericName: 'Esomeprazole Magnesium',
        packSize: '10x10 Capsules',
        mrp: 7,
        sellingPrice: 6.2,
        finalPrice: 5.58,
        quantity: 500
      }
    ],
    discountAmount: 150,
    couponCode: 'WELCOME100',
    vatAmount: 282,
    shippingCost: 350,
    grandTotal: 6122,
    paymentMethod: 'Bank',
    status: 'delivered',
    estimatedDelivery: '2026-07-06'
  },
  {
    id: 'ord-2',
    orderNumber: 'PS-2026-10002',
    date: '2026-07-06 09:30',
    customerDetails: {
      name: 'Al-Madina Pharmacy',
      email: 'madina.pharma@yahoo.com',
      phone: '01822233344',
      address: '12 Stadium Market, Chittagong',
      area: 'Kotwali',
      district: 'Chittagong',
      deliveryNote: 'Urgent stocking required'
    },
    items: [
      {
        productId: 'p-5',
        name: 'Mixtard 30 FlexPen',
        genericName: 'Soluble Insulin + Isophane Insulin',
        packSize: '5x3ml Pens',
        mrp: 410,
        sellingPrice: 380,
        finalPrice: 334.4,
        quantity: 15
      },
      {
        productId: 'p-3',
        name: 'Napa Extend 665',
        genericName: 'Paracetamol',
        packSize: '10x10 Tablets',
        mrp: 2.5,
        sellingPrice: 2.2,
        finalPrice: 2.2,
        quantity: 1000
      }
    ],
    discountAmount: 0,
    couponCode: '',
    vatAmount: 360.8,
    shippingCost: 500,
    grandTotal: 8076.8,
    paymentMethod: 'bKash',
    status: 'pending',
    estimatedDelivery: '2026-07-08'
  }
];
