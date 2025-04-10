export interface TransactionCreateParams {
  name: string;
  type: "Income" | "Expense";
  amount: number;
}

export interface Transaction {
  id: string;
  name: string;
  type: "Income" | "Expense";
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataWithMonth {
  month: string;
  income: number;
  expense: number;
}
