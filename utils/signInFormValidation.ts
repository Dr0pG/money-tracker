import { z } from "zod";

type FormErrors = {
  email: string;
  password: string;
};

type ResultValidation = {
  errors: FormErrors;
  hasError: boolean;
};

const signIpSchema = z.object({
  email: z
    .string({ required_error: "sign_up.form.email_is_required" })
    .nonempty("sign_up.form.email_is_required")
    .email("sign_up.form.invalid_email_format"),
  password: z
    .string({ required_error: "sign_up.form.password_is_required" })
    .nonempty("sign_up.form.password_is_required"),
});

const validateForm = (email: string, password: string): ResultValidation => {
  const result = signIpSchema.safeParse({ email, password });

  let errors: FormErrors = {
    email: "",
    password: "",
  };
  let hasError = false;

  if (!result.success) {
    hasError = true;
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof FormErrors;
      errors[field] = err.message;
    });
  }

  return { errors, hasError };
};

export { validateForm };
