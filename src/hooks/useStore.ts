import { useState, useCallback } from 'react';
import { Product, Order, OrderItem } from '@/types';

const initialProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 79.99, stock: 25, sku: 'WH-001', category: 'Electronics' },
  { id: '2', name: 'USB-C Cable', price: 12.99, stock: 100, sku: 'UC-001', category: 'Accessories' },
  { id: '3', name: 'Laptop Stand', price: 49.99, stock: 15, sku: 'LS-001', category: 'Accessories' },
  { id: '4', name: 'Mechanical Keyboard', price: 129.99, stock: 8, sku: 'MK-001', category: 'Electronics' },
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
    };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProductStock = useCallback((productId: string, quantity: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId ? { ...p, stock: p.stock - quantity } : p
      )
    );
  }, []);

  const validateStock = useCallback((items: OrderItem[]): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        errors.push(`Product not found`);
      } else if (product.stock < item.quantity) {
        errors.push(`${product.name}: Only ${product.stock} in stock, requested ${item.quantity}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }, [products]);

  const calculateTotal = useCallback((items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  }, [products]);

  const createOrder = useCallback((customerName: string, items: OrderItem[]): Order | null => {
    const { valid, errors } = validateStock(items);
    
    if (!valid) {
      console.error('Stock validation failed:', errors);
      return null;
    }

    const order: Order = {
      id: crypto.randomUUID(),
      items,
      total: calculateTotal(items),
      status: 'pending',
      createdAt: new Date(),
      customerName,
    };

    // Update stock
    items.forEach(item => updateProductStock(item.productId, item.quantity));
    
    setOrders(prev => [...prev, order]);
    return order;
  }, [validateStock, calculateTotal, updateProductStock]);

  return {
    products,
    orders,
    addProduct,
    validateStock,
    calculateTotal,
    createOrder,
  };
}
