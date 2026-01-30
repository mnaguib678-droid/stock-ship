import { useState, useMemo } from 'react';
import { Product, OrderItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CreateOrderFormProps {
  products: Product[];
  onCreateOrder: (customerName: string, items: OrderItem[]) => boolean;
  validateStock: (items: OrderItem[]) => { valid: boolean; errors: string[] };
  calculateTotal: (items: OrderItem[]) => number;
}

export function CreateOrderForm({
  products,
  onCreateOrder,
  validateStock,
  calculateTotal,
}: CreateOrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = (productId: string) => {
    const existingItem = items.find(i => i.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    if (existingItem) {
      setItems(prev =>
        prev.map(i =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setItems(prev => [...prev, { productId, quantity: 1, price: product.price }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i =>
          i.productId === productId
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const { valid, errors } = useMemo(() => validateStock(items), [items, validateStock]);
  const total = useMemo(() => calculateTotal(items), [items, calculateTotal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (!valid) {
      toast.error('Stock validation failed');
      return;
    }

    const success = onCreateOrder(customerName, items);
    
    if (success) {
      setCustomerName('');
      setItems([]);
      toast.success('Order created successfully');
    } else {
      toast.error('Failed to create order');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Create Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
            />
          </div>

          <div className="space-y-2">
            <Label>Add Products</Label>
            <div className="flex flex-wrap gap-2">
              {products.map(product => (
                <Button
                  key={product.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addItem(product.id)}
                  disabled={product.stock === 0}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {product.name}
                </Button>
              ))}
            </div>
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              <Label>Order Items</Label>
              <div className="space-y-2">
                {items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  const isOverStock = item.quantity > product.stock;

                  return (
                    <div
                      key={item.productId}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isOverStock ? 'bg-destructive/10 border border-destructive/20' : 'bg-secondary/50'
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-medium">{product.name}</span>
                        <p className="text-sm text-muted-foreground">
                          ${product.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.productId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="w-20 text-right font-semibold">
                          ${(product.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                {errors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            </div>
            <Button type="submit" disabled={!valid || items.length === 0} size="lg">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
