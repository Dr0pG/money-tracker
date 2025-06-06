import { z } from "zod";

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

const updateUserSchema = z.object({
  name: z
    .string({ required_error: "profile.name_is_required" })
    .nonempty("profile.name_is_required")
    .regex(/^[\p{L}\s]+$/u, "profile.name_contains_invalid_characters"),

  currency: z
    .string({ required_error: "profile.currency_is_required" })
    .nonempty("profile.currency_is_required")
    .regex(
      /^[€$£¥₹₩₽₺฿₴₪₦₫₲₵₡₱]$/,
      "profile.currency_contains_invalid_characters"
    ),
});

const validateUpdateUserForm = (
  name: string,
  currency: string
): ResultValidation => {
  const result = updateUserSchema.safeParse({ name, currency });

  const errors: FormErrors = {
    name: "",
    currency: "",
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

export { validateUpdateUserForm };
