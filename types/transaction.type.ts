export interface TransactionCreateParams {
  name: string;
  type: "Income" | "Expense";
  amount: number;
}
