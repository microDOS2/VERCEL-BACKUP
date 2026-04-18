import { useState } from 'react';
import { allProducts, wholesalerStarterKit } from '@/data/products';
import { ProductAccordion } from '@/components/products/ProductAccordion';
import { ProductTable } from '@/components/products/ProductTable';
import { StarterKitCard } from '@/components/products/StarterKitCard';
import { ViewToggle } from '@/components/products/ViewToggle';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartButton } from '@/components/cart/CartButton';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import type { UserRole } from '@/types/products';

// Mock user role - in production this would come from auth context
const currentUserRole: UserRole = 'distributor';

export function Products() {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.packagingOptions.some(
        (po) =>
          po.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          po.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-[#0a0514] py-8 px-4 sm:px-6 lg:px-8">
      <CartDrawer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-[#9a02d0]" />
              <h1 className="text-3xl font-bold text-white">Product Catalog</h1>
            </div>
            <p className="text-gray-400">
              Browse our complete product line with wholesale pricing
            </p>
          </div>
          <div className="sticky top-4 z-40">
            <CartButton />
          </div>
        </div>

        {/* Starter Kit Section */}
        <div className="mb-8">
          <StarterKitCard kit={wholesalerStarterKit} role={currentUserRole} />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <span className="text-gray-400 text-sm">
              {filteredProducts.reduce(
                (acc, p) => acc + p.packagingOptions.length,
                0
              )}{' '}
              options
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#150f24] border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-[#9a02d0]"
            />
          </div>
        </div>

        {/* Products Display */}
        {view === 'grid' ? (
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <ProductAccordion
                key={product.id}
                product={product}
                role={currentUserRole}
              />
            ))}
          </div>
        ) : (
          <ProductTable products={filteredProducts} role={currentUserRole} />
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
