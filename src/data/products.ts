import type { Product, WholesalerStarterKit } from '@/types/products';

// Box Product (10 pills per box)
export const boxProduct: Product = {
  id: 'box-10',
  name: 'Box',
  description: '10 pills per box',
  basePillCount: 10,
  image: '/placeholder-box.png',
  packagingOptions: [
    {
      id: 'box-individual',
      tier: 'individual',
      name: 'Individual',
      quantity: 1,
      totalPills: 10,
      pricing: {
        msrp: 45.00,
        wholesalerPrice: 22.50,
        distributorPrice: 16.86,
      },
      sku: 'MD2-BX-001',
      inStock: true,
    },
    {
      id: 'box-case',
      tier: 'case',
      name: 'Case (12 boxes)',
      quantity: 12,
      totalPills: 120,
      pricing: {
        msrp: 540.00,
        wholesalerPrice: 270.00,
        distributorPrice: 202.32,
      },
      sku: 'MD2-BX-012',
      inStock: true,
    },
    {
      id: 'box-master',
      tier: 'master_case',
      name: 'Master Case (36 boxes)',
      quantity: 36,
      totalPills: 360,
      pricing: {
        msrp: 1620.00,
        wholesalerPrice: 810.00,
        distributorPrice: 606.96,
      },
      sku: 'MD2-BX-036',
      inStock: true,
    },
  ],
};

// Starter Card Product (2 pills per card)
export const starterCardProduct: Product = {
  id: 'starter-card',
  name: 'Starter Card',
  description: '2 pills in blister package',
  basePillCount: 2,
  image: '/placeholder-card.png',
  packagingOptions: [
    {
      id: 'card-individual',
      tier: 'individual',
      name: 'Individual',
      quantity: 1,
      totalPills: 2,
      pricing: {
        msrp: 9.95,
        wholesalerPrice: 4.98,
        distributorPrice: 3.73,
      },
      sku: 'MD2-SC-001',
      inStock: true,
    },
    {
      id: 'card-case',
      tier: 'case',
      name: 'Case (21 cards)',
      quantity: 21,
      totalPills: 42,
      pricing: {
        msrp: 208.95,
        wholesalerPrice: 104.58,
        distributorPrice: 78.33,
      },
      sku: 'MD2-SC-021',
      inStock: true,
    },
    {
      id: 'card-master',
      tier: 'master_case',
      name: 'Master Case (63 cards)',
      quantity: 63,
      totalPills: 126,
      pricing: {
        msrp: 626.85,
        wholesalerPrice: 313.74,
        distributorPrice: 234.99,
      },
      sku: 'MD2-SC-063',
      inStock: true,
    },
  ],
};

// Wholesaler Starter Kit
export const wholesalerStarterKit: WholesalerStarterKit = {
  id: 'wholesaler-kit',
  name: 'Wholesaler Starter Kit',
  description: 'Everything to get started selling microDOS(2)',
  contents: {
    boxes: 9,
    starterCards: 7,
    display: true,
    placard: true,
  },
  totalPills: 104,
  pricing: {
    msrp: 474.65,
    wholesalerPrice: 155.76,
    distributorPrice: 116.82,
  },
  sku: 'MD2-KIT-WHOLESALE',
  inStock: true,
};

// All products array
export const allProducts: Product[] = [boxProduct, starterCardProduct];

// Get packaging option by ID
export function getPackagingOption(productId: string, packagingId: string) {
  const product = allProducts.find(p => p.id === productId);
  if (!product) return null;
  return product.packagingOptions.find(po => po.id === packagingId) || null;
}

// Get price based on user role
export function getPrice(pricing: { msrp: number; wholesalerPrice: number; distributorPrice: number }, role: string): number {
  switch (role) {
    case 'distributor':
      return pricing.distributorPrice;
    case 'wholesaler':
      return pricing.wholesalerPrice;
    case 'sales_rep':
    case 'sales_manager':
    case 'admin':
      return pricing.distributorPrice;
    default:
      return pricing.msrp;
  }
}

// Format currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}
