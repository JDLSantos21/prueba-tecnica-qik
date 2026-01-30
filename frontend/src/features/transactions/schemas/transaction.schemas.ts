import { z } from "zod";

export const createTransactionSchema = z.object({
  amount: z
    .string()
    .min(1, "El monto es requerido")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "El monto debe ser mayor a 0",
    }),
  description: z.string().optional(),
});

export const transferSchema = z
  .object({
    toAccountId: z.string().optional(),
    toAccountNumber: z.string().optional(),
    amount: z
      .string()
      .min(1, "El monto es requerido")
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "El monto debe ser mayor a 0",
      }),
    description: z.string().optional(),
  })
  .refine((data) => data.toAccountId || data.toAccountNumber, {
    message: "Debes seleccionar una cuenta o ingresar un número de cuenta",
    path: ["toAccountId"],
  });

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;
