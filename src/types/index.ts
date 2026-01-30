export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  category: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  customerName: string;
}
