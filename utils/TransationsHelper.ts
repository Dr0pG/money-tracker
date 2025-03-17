import {
  TransactionCategory,
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

  const setError = (field: keyof FormErrors, message: string) => {
    errors[field] = message;
  };

  const REQUIRED_MESSAGE = "sign_up.form.password_is_required";

  if (!state.type || !Object.values(TransactionType).includes(state.type)) {
    setError("type", REQUIRED_MESSAGE);
  }

  if (!state.wallet) {
    setError("wallet", REQUIRED_MESSAGE);
  }

  if (state.type === TransactionType.Expense) {
    if (
      !state.category ||
      !Object.values(TransactionCategory).includes(state.category)
    ) {
      setError("category", REQUIRED_MESSAGE);
    }
  }

  if (!state.date) {
    setError("date", REQUIRED_MESSAGE);
  }

  if (!state.amount) {
    setError("amount", REQUIRED_MESSAGE);
  }

  const hasError = Object.keys(errors).length > 0;

  return { errors, hasError };
};

export { isFormValidated, validateForm };

