import { z } from "zod";

import {
  TransactionCategory,
  TransactionFields,
  TransactionForm,
  TransactionType,
  Wallet,
} from "@/store/walletStore";
import { addNumbers, subtractNumbers } from "@/utils/Helpers";

type ResultValidation = {
  errors: FormErrors;
  hasError: boolean;
};

const isFormValidated = (state: TransactionForm): boolean => {
  if (!state.type || !state.wallet || !state.date || !state.amount) {
    return false;
  }

  if (state.type === TransactionType.Expense && !state.category) {
    return false;
  }

  return true;
};

type FormErrors = Partial<Record<TransactionFields, string>>;

const REQUIRED_MESSAGE = "sign_up.form.password_is_required";

// Transaction schema
const transactionSchema = z
  .object({
    type: z.nativeEnum(TransactionType, {
      errorMap: () => ({ message: REQUIRED_MESSAGE }),
    }),

    wallet: z.string().nonempty(REQUIRED_MESSAGE),

    date: z.string().nonempty(REQUIRED_MESSAGE),

    amount: z
      .string()
      .nonempty(REQUIRED_MESSAGE)
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: REQUIRED_MESSAGE,
      }),

    description: z.string().optional(),

    category: z
      .union([z.nativeEnum(TransactionCategory), z.literal(""), z.undefined()])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === TransactionType.Expense) {
      if (
        !data.category ||
        !Object.values(TransactionCategory).includes(data.category)
      ) {
        ctx.addIssue({
          path: ["category"],
          code: z.ZodIssueCode.custom,
          message: REQUIRED_MESSAGE,
        });
      }
    }
  });

const validateForm = (state: TransactionForm): ResultValidation => {
  const result = transactionSchema.safeParse(state);

  const errors: FormErrors = {};
  let hasError = false;

  if (!result.success) {
    hasError = true;
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof Omit<TransactionForm, "id">;
      errors[field] = err.message;
    });
  }

  return { errors, hasError };
};

const formatTotalTransactions = (currentWallet: Wallet) => {
  if (!currentWallet) return null;

  let income = 0;
  let expense = 0;

  currentWallet.transactions?.forEach((transaction) => {
    if (transaction.type === TransactionType.Income) {
      income = addNumbers(income, transaction.amount);
    } else {
      expense = addNumbers(expense, transaction.amount);
    }
  });

  return {
    ...currentWallet,
    income,
    expense,
  };
};

const totalWallets = (currentWallets: Wallet[]) => {
  if (!currentWallets?.length) return 0;

  let income = 0;
  let expense = 0;

  currentWallets.map((currentWallet: Wallet) => {
    currentWallet.transactions?.forEach((transaction) => {
      if (transaction.type === TransactionType.Income) {
        income = addNumbers(income, transaction.amount);
      } else {
        expense = addNumbers(expense, transaction.amount);
      }
    });
  });

  const total = subtractNumbers(income, expense);
  return total;
};

export { formatTotalTransactions, isFormValidated, totalWallets, validateForm };
