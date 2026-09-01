import { Product, SaleRecord, AgendaTask } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'ECHIC-101',
    name: 'Vestido Midi Seda Vinho Marsala',
    quantity: 8,
    costPrice: 65.00,
    sellingPrice: 169.90,
    photo: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    category: 'Vestidos',
    size: 'M',
    color: 'Vinho Marsala',
    description: 'Vestido midi em crepe acetinado com caimento fluido, decote sutil em V e acabamento premium Eternal Chic.',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'prod-2',
    code: 'ECHIC-102',
    name: 'Conjunto Alfaiataria Chic Bordô',
    quantity: 5,
    costPrice: 95.00,
    sellingPrice: 249.90,
    photo: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
    category: 'Conjuntos',
    size: 'G',
    color: 'Bordô',
    description: 'Blazer estruturado com botões forrados e calça pantalona de alfaiataria fina.',
    createdAt: '2026-08-21T11:30:00.000Z'
  },
  {
    id: 'prod-3',
    code: 'ECHIC-103',
    name: 'Camisa Cetim Luxo Pérola com Laço',
    quantity: 12,
    costPrice: 42.00,
    sellingPrice: 119.90,
    photo: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    category: 'Blusas',
    size: 'P',
    color: 'Off-White / Pérola',
    description: 'Camisa manga longa em cetim com toque de seda e gola laço removível.',
    createdAt: '2026-08-22T09:15:00.000Z'
  },
  {
    id: 'prod-4',
    code: 'ECHIC-104',
    name: 'Macacão Pantalona Elegance Rosé',
    quantity: 4,
    costPrice: 85.00,
    sellingPrice: 219.00,
    photo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    category: 'Macacões',
    size: 'M',
    color: 'Rosé Quartz',
    description: 'Macacão com cinto encapado, decote transpassado e caimento reto alongador.',
    createdAt: '2026-08-23T14:20:00.000Z'
  },
  {
    id: 'prod-5',
    code: 'ECHIC-105',
    name: 'Saia Plissada Metalizada Champanhe',
    quantity: 7,
    costPrice: 48.00,
    sellingPrice: 139.90,
    photo: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    category: 'Saias',
    size: 'Único',
    color: 'Champanhe',
    description: 'Saia plissada com cós elástico anatômico e brilho sutil sofisticado.',
    createdAt: '2026-08-24T16:00:00.000Z'
  },
  {
    id: 'prod-6',
    code: 'ECHIC-106',
    name: 'Cropped Linho Bordado com Pérolas',
    quantity: 10,
    costPrice: 35.00,
    sellingPrice: 98.00,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    category: 'Blusas',
    size: 'M',
    color: 'Cru Natural',
    description: 'Top cropped em linho puro com detalhe bordado artesanal no decote.',
    createdAt: '2026-08-25T10:45:00.000Z'
  },
  {
    id: 'prod-7',
    code: 'ECHIC-107',
    name: 'Vestido Longo Envelope Terracota',
    quantity: 6,
    costPrice: 72.00,
    sellingPrice: 189.90,
    photo: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    category: 'Vestidos',
    size: 'G',
    color: 'Terracota',
    description: 'Vestido longo modelo wrap dress que modela a cintura com fenda lateral elegante.',
    createdAt: '2026-08-26T08:30:00.000Z'
  }
];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-1',
    productId: 'prod-1',
    productCode: 'ECHIC-101',
    productName: 'Vestido Midi Seda Vinho Marsala',
    quantity: 2,
    unitCostPrice: 65.00,
    unitSellingPrice: 169.90,
    totalAmount: 339.80,
    totalCost: 130.00,
    totalProfit: 209.80,
    paymentMethod: 'pix',
    timestamp: '2026-08-27T15:30:00.000Z',
    notes: 'Venda presencial para cliente VIP Mariana'
  },
  {
    id: 'sale-2',
    productId: 'prod-3',
    productCode: 'ECHIC-103',
    productName: 'Camisa Cetim Luxo Pérola com Laço',
    quantity: 1,
    unitCostPrice: 42.00,
    unitSellingPrice: 119.90,
    totalAmount: 119.90,
    totalCost: 42.00,
    totalProfit: 77.90,
    paymentMethod: 'credit',
    timestamp: '2026-08-28T11:15:00.000Z',
    notes: 'Parcelado em 2x'
  },
  {
    id: 'sale-3',
    productId: 'prod-5',
    productCode: 'ECHIC-105',
    productName: 'Saia Plissada Metalizada Champanhe',
    quantity: 1,
    unitCostPrice: 48.00,
    unitSellingPrice: 139.90,
    totalAmount: 139.90,
    totalCost: 48.00,
    totalProfit: 91.90,
    paymentMethod: 'pix',
    timestamp: '2026-08-28T14:40:00.000Z',
    notes: 'Venda via WhatsApp'
  }
];

export const INITIAL_TASKS: AgendaTask[] = [
  {
    id: 'task-1',
    title: 'Fotografar novos vestidos para o catálogo e Instagram',
    date: '2026-08-29',
    time: '09:30',
    description: 'Montar arara com os vestidos vinho e acessórios para a sessão de fotos da semana.',
    category: 'fotos',
    completed: false,
    priority: 'alta',
    createdAt: '2026-08-28T09:00:00.000Z'
  },
  {
    id: 'task-2',
    title: 'Live Shop no Instagram Eternal Chic',
    date: '2026-08-29',
    time: '19:00',
    description: 'Apresentar a coleção cápsula Marsala & Pérola com cupons de lançamento.',
    category: 'vendas',
    completed: false,
    priority: 'alta',
    createdAt: '2026-08-28T09:10:00.000Z'
  },
  {
    id: 'task-3',
    title: 'Fazer pedidos de reposição com fornecedor de tecidos',
    date: '2026-08-31',
    time: '14:00',
    description: 'Checar peças com baixo estoque e solicitar mais linho e crepe de seda.',
    category: 'estoque',
    completed: false,
    priority: 'media',
    createdAt: '2026-08-28T10:00:00.000Z'
  },
  {
    id: 'task-4',
    title: 'Conferir fechamento de caixa e lucro da semana',
    date: '2026-08-30',
    time: '18:00',
    description: 'Verificar pagamentos em Pix e maquininha de cartão.',
    category: 'financeiro',
    completed: true,
    priority: 'media',
    createdAt: '2026-08-28T11:00:00.000Z'
  }
];

export const FASHION_PHOTO_PRESETS = [
  { label: 'Vestido Marsala', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Conjunto Alfaiataria', url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Camisa Cetim', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Macacão Elegance', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
  { label: 'Saia Plissada', url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cropped Linho', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vestido Terracota', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Blusa Rendada', url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80' },
  { label: 'Calça Alfaiataria', url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80' },
  { label: 'Vestido Festa Chic', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80' },
];
