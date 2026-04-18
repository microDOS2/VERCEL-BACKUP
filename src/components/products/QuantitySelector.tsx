import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface QuantitySelectorProps {
  onAddToCart?: (quantity: number) => void;
  maxQuantity?: number;
}

export function QuantitySelector({ onAddToCart, maxQuantity = 999 }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.(quantity);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-[#0a0514] rounded-lg border border-white/10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="w-14 h-8 text-center bg-transparent border-0 text-white focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={1}
          max={maxQuantity}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Button
        onClick={handleAddToCart}
        className="bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90 flex items-center gap-2"
        size="sm"
      >
        <ShoppingCart className="w-4 h-4" />
        Add
      </Button>
    </div>
  );
}
