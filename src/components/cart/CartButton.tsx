import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className = '' }: CartButtonProps) {
  const { totalItems, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className={`relative flex items-center gap-2 px-4 py-2 bg-[#150f24] border border-white/10 rounded-lg hover:bg-white/5 transition-colors ${className}`}
    >
      <ShoppingCart className="w-5 h-5 text-[#9a02d0]" />
      <span className="text-white hidden sm:inline">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-[#9a02d0] to-[#44f80c] rounded-full flex items-center justify-center text-white text-xs font-bold">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  );
}
