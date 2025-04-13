type FormErrors = {
  name: string;
  currency: string;
};

type ResultValidation = {
  errors: {
    name: string;
    currency: string;
  };
  hasError: boolean;
};

const validateUpdateUserForm = (
  name: string,
  currency: string
): ResultValidation => {
  let errors: FormErrors = {
    name: "",
    currency: "",
  };

  // Validate name
  const nameRegex = /^[\p{L}\s]+$/u;
  if (!name) {
    errors = {
      ...errors,
      name: "profile.name_is_required",
    };
  } else if (!nameRegex.test(name)) {
    errors = {
      ...errors,
      name: "profile.name_contains_invalid_characters",
    };
  }

  // Validate currency
  const currencyRegex = /^[€$£¥₹₩₽₺฿₴₪₦₫₲₵₡₱]$/;
  if (!currency) {
    errors = {
      ...errors,
      currency: "profile.currency_is_required",
    };
  } else if (!currencyRegex.test(currency)) {
    errors = {
      ...errors,
      currency: "profile.currency_contains_invalid_characters",
    };
  }

  const hasError = Object.values(errors).some((value) => value !== "");

  return { errors, hasError };
};

export { validateUpdateUserForm };
