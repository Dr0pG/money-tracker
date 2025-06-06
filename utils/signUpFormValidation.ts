import { z } from "zod";

const signUpSchema = z.object({
  name: z
    .string({ required_error: "sign_up.form.name_is_required" })
    .nonempty("sign_up.form.name_is_required")
    .regex(/^[\p{L}\s]+$/u, "sign_up.form.name_contains_invalid_characters"),

  email: z
    .string({ required_error: "sign_up.form.email_is_required" })
    .nonempty("sign_up.form.email_is_required")
    .email("sign_up.form.invalid_email_format"),

  password: z
    .string({ required_error: "sign_up.form.password_is_required" })
    .nonempty("sign_up.form.password_is_required")
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "sign_up.form.password_must_be_at_least"
    ),
});

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
  const result = signUpSchema.safeParse({ name, email, password });

  let errors: FormErrors = {
    name: "",
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
