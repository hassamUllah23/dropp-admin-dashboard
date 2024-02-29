import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First Name is too short.")
    .max(50, "First Name is too long.")
    .matches(/^[a-zA-Z\s]*$/, "Name containt letters only")
    .required("First Name is required")
    .trim(),
  lastName: Yup.string()
    .min(3, "Last Name is too short.")
    .max(50, "Last Name is too long.")
    .matches(/^[a-zA-Z\s]*$/, "Name containt letters only")
    .required("Last Name is required")
    .trim(),
  userName: Yup.string()
    .min(3, "Username is too short.")
    .max(50, "Username is too long.")
    .matches(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
    .required("Username is required")
    .trim(),
  password: Yup.string()
    .min(8, "Minimum 8 characters are required.")
    .max(16, "Maximum 16 character are required.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{8,16}$/,
      "Password must contain at least one number, one uppercase letter, one lowercase letter and one special character!"
    )
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  consentChecked: Yup.boolean().oneOf([true], "Must accept Terms & Conditions"),
});

export const signInSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const sendEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address"),
});
