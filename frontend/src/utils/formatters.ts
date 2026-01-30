import { colors } from "@/theme";

export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
): string {
  return new Date(dateString).toLocaleDateString("es-ES", options);
}

export function formatCurrency(
  amount: number,
  currency: string = "DOP",
): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatAccountNumber(
  accountNumber: string,
  showFull: boolean = false,
): string {
  if (showFull) return accountNumber;
  return `••••${accountNumber.slice(-4)}`;
}

export function getTransactionSign(type: "CREDIT" | "DEBIT"): string {
  return type === "CREDIT" ? "+" : "-";
}
export function getTransactionColor(type: "CREDIT" | "DEBIT"): string {
  return type === "CREDIT" ? colors.success[500] : colors.danger[500];
}
