export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  emailVerified: boolean;
}

export interface ProductType {
  product: string;
  productName: string;
  price: number;
  currency: string;
  recurring: string;
  archived: boolean;
}

export interface CustomerType {
  customerEmail: string;
  customerName: string;
  email: string;
  description: string;
  archived: boolean;
}

export interface InvoiceType {
  amount: number;
  currency: string;
  createdAt: number;
  customerEmail: string;
  customerName: string;
  dueAt: number;
  products: {
    product: string;
    productName: string;
    currency: string;
    price: number;
    quantity: number;
    archived: boolean;
    recurring: string;
  }[];
  notes: string;
  paid: boolean;
  paidAt?: number;
  status: string;
}

export interface SubscriptionType {
  amount: number;
  currency: string;
  createdAt: number;
  customerEmail: string;
  customerName: string;
  startAt: number;
  freeTrialDays: number;
  recurringEveryDays: number;
  nextInvoiceAt: number;
  endAt: number;
  products: {
    product: string;
    productName: string;
    currency: string;
    price: number;
    quantity: number;
    archived: boolean;
    recurring: string;
  }[];
  notes: string;
  status: string;
  canceled: boolean;
}
