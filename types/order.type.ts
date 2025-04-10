export interface OrderCreateParams {
  userId: string;
  productId: string;
  price: number;
  discount_price: number;
  discount_rate: number;
  total: number;
}
