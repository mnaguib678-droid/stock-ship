import { useStore } from '@/hooks/useStore';
import { StatsCards } from '@/components/StatsCards';
import { ProductList } from '@/components/ProductList';
import { AddProductForm } from '@/components/AddProductForm';
import { CreateOrderForm } from '@/components/CreateOrderForm';
import { OrderList } from '@/components/OrderList';
import { Package } from 'lucide-react';

const Index = () => {
  const { products, orders, addProduct, validateStock, calculateTotal, createOrder } = useStore();

  const handleCreateOrder = (customerName: string, items: any[]) => {
    const order = createOrder(customerName, items);
    return order !== null;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">OrderFlow</h1>
              <p className="text-sm text-muted-foreground">Order Management System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <StatsCards products={products} orders={orders} />

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AddProductForm onAddProduct={addProduct} />
              <ProductList products={products} />
            </div>

            <div className="space-y-6">
              <CreateOrderForm
                products={products}
                onCreateOrder={handleCreateOrder}
                validateStock={validateStock}
                calculateTotal={calculateTotal}
              />
              <OrderList orders={orders} products={products} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
