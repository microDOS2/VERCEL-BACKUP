import { formatPrice } from '@/data/products';
import type { UserRole } from '@/types/products';

interface PricingDisplayProps {
  pricing: {
    msrp: number;
    wholesalerPrice: number;
    distributorPrice: number;
  };
  role: UserRole;
  showAll?: boolean;
}

export function PricingDisplay({ pricing, role, showAll = false }: PricingDisplayProps) {
  const isDistributor = role === 'distributor' || role === 'admin' || role === 'sales_manager' || role === 'sales_rep';
  const isWholesaler = role === 'wholesaler';

  // For internal users (admin, sales_manager, sales_rep), show all prices with distributor as "Your Price"
  const isInternal = role === 'admin' || role === 'sales_manager' || role === 'sales_rep';

  if (showAll || isInternal) {
    return (
      <div className="space-y-1">
        {/* MSRP - strikethrough */}
        <div className="text-gray-500 line-through text-sm">
          MSRP: {formatPrice(pricing.msrp)}
        </div>
        
        {/* Wholesaler Price */}
        <div className={`text-sm ${isWholesaler ? 'hidden' : 'text-gray-400'}`}>
          Wholesaler: {formatPrice(pricing.wholesalerPrice)}
        </div>
        
        {/* Distributor Price - highlighted */}
        <div className="flex items-center gap-2">
          <span className="text-[#44f80c] font-bold text-lg">
            {formatPrice(pricing.distributorPrice)}
          </span>
          <span className="text-xs bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white px-2 py-0.5 rounded-full">
            YOUR PRICE
          </span>
        </div>
      </div>
    );
  }

  // For Distributor - show all three prices
  if (isDistributor) {
    return (
      <div className="space-y-1">
        <div className="text-gray-500 line-through text-sm">
          MSRP: {formatPrice(pricing.msrp)}
        </div>
        <div className="text-gray-400 text-sm">
          Wholesaler: {formatPrice(pricing.wholesalerPrice)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#44f80c] font-bold text-lg">
            {formatPrice(pricing.distributorPrice)}
          </span>
          <span className="text-xs bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white px-2 py-0.5 rounded-full">
            YOUR PRICE
          </span>
        </div>
      </div>
    );
  }

  // For Wholesaler - show only MSRP and their price
  return (
    <div className="space-y-1">
      <div className="text-gray-500 line-through text-sm">
        MSRP: {formatPrice(pricing.msrp)}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#44f80c] font-bold text-lg">
          {formatPrice(pricing.wholesalerPrice)}
        </span>
        <span className="text-xs bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white px-2 py-0.5 rounded-full">
          YOUR PRICE
        </span>
      </div>
    </div>
  );
}

// Compact version for table view
export function PricingDisplayCompact({ pricing, role }: PricingDisplayProps) {
  const isDistributor = role === 'distributor';
  const isWholesaler = role === 'wholesaler';
  const isInternal = role === 'admin' || role === 'sales_manager' || role === 'sales_rep';

  if (isInternal || isDistributor) {
    return (
      <div className="space-y-0.5 text-sm">
        <div className="text-gray-500 line-through">{formatPrice(pricing.msrp)}</div>
        {!isWholesaler && <div className="text-gray-400">{formatPrice(pricing.wholesalerPrice)}</div>}
        <div className="text-[#44f80c] font-semibold">{formatPrice(pricing.distributorPrice)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 text-sm">
      <div className="text-gray-500 line-through">{formatPrice(pricing.msrp)}</div>
      <div className="text-[#44f80c] font-semibold">{formatPrice(pricing.wholesalerPrice)}</div>
    </div>
  );
}
