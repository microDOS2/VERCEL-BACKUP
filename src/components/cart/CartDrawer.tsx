import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/data/products';

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, isOpen, setIsOpen } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="bg-[#150f24] border-l border-white/10 w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#9a02d0]" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
              <p className="text-gray-500 text-sm mt-1">
                Add products to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0a0514] rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-medium">{item.productName}</h4>
                      <p className="text-gray-400 text-sm">{item.packagingName}</p>
                      <p className="text-gray-500 text-xs">SKU: {item.sku}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded bg-[#150f24] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded bg-[#150f24] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[#44f80c] font-medium">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white text-xl font-bold">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1 border-white/10 text-gray-400 hover:bg-white/5"
              >
                Clear
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-[#9a02d0] to-[#44f80c] text-white hover:opacity-90">
                Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
