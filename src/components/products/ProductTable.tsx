import type { Product, UserRole } from '@/types/products';
import { PricingDisplayCompact } from './PricingDisplay';
import { QuantitySelector } from './QuantitySelector';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { getPrice } from '@/data/products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductTableProps {
  products: Product[];
  role: UserRole;
}

export function ProductTable({ products, role }: ProductTableProps) {
  const { addItem, setIsOpen } = useCart();

  // Flatten all packaging options for table view
  const rows = products.flatMap((product) =>
    product.packagingOptions.map((packaging) => ({
      productName: product.name,
      ...packaging,
    }))
  );

  const handleAddToCart = (row: typeof rows[0], quantity: number) => {
    const unitPrice = getPrice(row.pricing, role);
    addItem({
      id: `${row.sku}-${Date.now()}`,
      productName: row.productName,
      packagingName: row.name,
      sku: row.sku,
      quantity,
      unitPrice,
    });
    setIsOpen(true);
    toast.success(`Added ${quantity} × ${row.name} to cart`, {
      description: `${row.productName} — ${row.sku}`,
    });
  };

  return (
    <div className="bg-[#150f24] rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Packaging</TableHead>
              <TableHead className="text-gray-400 text-right">Pills</TableHead>
              <TableHead className="text-gray-400">Pricing</TableHead>
              <TableHead className="text-gray-400">Stock</TableHead>
              <TableHead className="text-gray-400 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium text-white">{row.productName}</TableCell>
                <TableCell>
                  <div>
                    <div className="text-white">{row.name}</div>
                    <div className="text-xs text-gray-500">{row.sku}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-gray-300">{row.totalPills}</TableCell>
                <TableCell>
                  <PricingDisplayCompact pricing={row.pricing} role={role} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={row.inStock ? 'default' : 'secondary'}
                    className={
                      row.inStock
                        ? 'bg-[#44f80c]/20 text-[#44f80c] border-[#44f80c]/30'
                        : 'bg-gray-800 text-gray-400'
                    }
                  >
                    {row.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {row.inStock && (
                    <QuantitySelector
                      onAddToCart={(qty) => handleAddToCart(row, qty)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
