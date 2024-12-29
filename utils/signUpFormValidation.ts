type FormErrors = {
  name: string;
  email: string;
  password: string;
};

type ResultValidation = {
  errors: {
    name: string;
    email: string;
    password: string;
  };
  hasError: boolean;
};

const validateForm = (
  name: string,
  email: string,
  password: string
): ResultValidation => {
  let errors: FormErrors = {
    name: "",
    email: "",
    password: "",
  };

  // Validate name
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!name) {
    errors = {
      ...errors,
      name: "sign_up.form.name_is_required",
    };
  } else if (!nameRegex.test(name)) {
    errors = {
      ...errors,
      name: "sign_up.form.name_contains_invalid_characters",
    };
  }

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

  // Validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!password) {
    errors = {
      ...errors,
      password: "sign_up.form.password_is_required",
    };
  } else if (!passwordRegex.test(password)) {
    errors = {
      ...errors,
      password: "sign_up.form.password_must_be_at_least",
    };
  }

  const hasError = Object.values(errors).some((value) => value !== "");

  return { errors, hasError };
};

export { validateForm };
