import type { PackagingOption, UserRole } from '@/types/products';
import { PricingDisplay } from './PricingDisplay';
import { QuantitySelector } from './QuantitySelector';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { getPrice } from '@/data/products';
import { toast } from 'sonner';

interface PackagingCardProps {
  packaging: PackagingOption;
  productName: string;
  role: UserRole;
}

export function PackagingCard({ packaging, productName, role }: PackagingCardProps) {
  const { addItem, setIsOpen } = useCart();
  
  const handleAddToCart = (quantity: number) => {
    const unitPrice = getPrice(packaging.pricing, role);
    addItem({
      id: `${packaging.id}-${Date.now()}`,
      productName,
      packagingName: packaging.name,
      sku: packaging.sku,
      quantity,
      unitPrice,
    });
    toast.success(`Added ${quantity} × ${packaging.name} to cart`, {
      description: `${productName} - ${packaging.sku}`,
    });
    setIsOpen(true);
  };

  return (
    <div className="bg-[#0a0514] rounded-lg border border-white/10 p-4 flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="text-white font-semibold">{packaging.name}</h4>
          <p className="text-gray-400 text-sm">{packaging.totalPills} pills total</p>
        </div>
        <Badge 
          variant={packaging.inStock ? 'default' : 'secondary'}
          className={packaging.inStock 
            ? 'bg-[#44f80c]/20 text-[#44f80c] border-[#44f80c]/30' 
            : 'bg-gray-800 text-gray-400'
          }
        >
          {packaging.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </div>
      
      <div className="text-xs text-gray-500 mb-3">SKU: {packaging.sku}</div>
      
      <div className="mt-auto">
        <PricingDisplay pricing={packaging.pricing} role={role} />
        
        {packaging.inStock && (
          <div className="mt-4">
            <QuantitySelector onAddToCart={handleAddToCart} />
          </div>
        )}
      </div>
    </div>
  );
}
