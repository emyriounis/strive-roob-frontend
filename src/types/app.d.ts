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
