export interface Product {
  id: string;
  code: string;
  name: string;
  quantity: number;
  costPrice: number;    // Valor que pagou (R$)
  sellingPrice: number; // Valor que vai cobrar (R$)
  photo: string;
  category: string;
  size?: string;
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SaleRecord {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitCostPrice: number;
  unitSellingPrice: number;
  totalAmount: number;
  totalCost: number;
  totalProfit: number;
  paymentMethod: 'pix' | 'credit' | 'debit' | 'cash';
  timestamp: string;
  notes?: string;
}

export interface AgendaTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  description?: string;
  category: 'estoque' | 'vendas' | 'fotos' | 'atelie' | 'financeiro' | 'cliente' | 'outro';
  completed: boolean;
  priority: 'alta' | 'media' | 'baixa';
  createdAt: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'register'
  | 'catalog'
  | 'pricing'
  | 'pos'
  | 'agenda'
  | 'spreadsheet';
