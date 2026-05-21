import { transferMoney as txTransfer } from "./transactions.service";

export type TransferPayload = {
  from_account_id: number;
  to_account_id: number;
  amount: number;
};

export function transferMoney(data: TransferPayload) {
  return txTransfer(data as any);
}
