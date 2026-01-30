import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle } from 'lucide-react';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Package className="h-5 w-5 text-primary" />
          Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {product.sku}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1">
                    {product.stock <= 10 && (
                      <AlertTriangle className="h-3 w-3 text-warning" />
                    )}
                    <span
                      className={`text-sm ${
                        product.stock <= 10 ? 'text-warning' : 'text-muted-foreground'
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
