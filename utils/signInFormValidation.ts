type FormErrors = {
  email: string;
  password: string;
};

const validateForm = (email: string, password: string): FormErrors => {
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

  return errors;
};

export { validateForm };
