import {
  TransactionCategory,
  TransactionFields,
  TransactionForm,
  TransactionType,
} from "@/store/walletStore";

type FormErrors = {
  type: string;
  wallet: string;
  category: string;
  date: string;
  amount: string;
  description: string;
};

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

const validateForm = (state: TransactionForm): ResultValidation => {
  const errors: FormErrors = {
    type: "",
    wallet: "",
    category: "",
    date: "",
    amount: "",
    description: "",
  };

  const REQUIRED_MESSAGE = "sign_up.form.password_is_required";

  if (!state.type || !Object.values(TransactionType).includes(state.type)) {
    errors[TransactionFields.Type] = REQUIRED_MESSAGE;
  }

  if (!state.wallet) {
    errors[TransactionFields.Wallet] = REQUIRED_MESSAGE;
  }

  if (state.type === TransactionType.Expense) {
    if (
      !state.category ||
      !Object.values(TransactionCategory).includes(state.category)
    ) {
      errors[TransactionFields.Category] = REQUIRED_MESSAGE;
    }
  }

  if (!state.date) {
    errors[TransactionFields.Date] = REQUIRED_MESSAGE;
  }

  if (!state.amount) {
    errors[TransactionFields.Amount] = REQUIRED_MESSAGE;
  }

  const hasError = Object.values(errors).some((error) => error !== "");

  return { errors, hasError };
};

export { isFormValidated, validateForm };

