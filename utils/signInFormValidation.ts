type FormErrors = {
  email: string;
  password: string;
};

type ResultValidation = {
  errors: FormErrors;
  hasError: boolean;
};

const validateForm = (email: string, password: string): ResultValidation => {
  let errors: FormErrors = {
    email: "",
    password: "",
  };

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors = {
      ...errors,
      email: "sign_up.form.email_is_required",
    };
  } else if (!emailRegex.test(email)) {
    errors = {
      ...errors,
      email: "sign_up.form.invalid_email_format",
    };
  }

  if (!password) {
    errors = {
      ...errors,
      password: "sign_up.form.password_is_required",
    };
  }

  const hasError = Object.values(errors).some((value) => value !== "");

  return { errors, hasError };
};

export { validateForm };

