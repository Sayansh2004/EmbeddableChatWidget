import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Import the action from our authSlice so we can store user info in Redux.
import { setUser } from "../utils/authSlice";

export default function Login() {
  const user = useSelector((store) => store.auth?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Validation schema for the login form.
  const loginValidation = Yup.object({
    emailId: Yup.string()
      .required("Email id is required")
      .email("Please enter a valid email"),
    password: Yup.string()
      .min(8, "minimum 8 characters are required")
      .matches(/[A-Z]/, "Must contain one uppercase letter")
      .matches(/[a-z]/, "Must contain one lowercase letter")
      .matches(/[0-9]/, "must contain one digit")
      .matches(/[#$%^&*@]/, "must contain a special character")
      .required("password is required"),
  });

  // Validation schema for the signup form (adds first/last name + optional photo).
  const signupValidation = loginValidation.shape({
    firstName: Yup.string()
      .min(2, "Minimum 2 characters")
      .max(50, "Maximum 50 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Minimum 2 characters")
      .max(50, "Maximum 50 characters")
      .required("Last name is required"),
    photoUrl: Yup.string()
      .url("Please enter a valid URL")
      .nullable(),
  });

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      photoUrl: "",
    },
    validationSchema: isLogin ? loginValidation : signupValidation,
    onSubmit: async (values, { resetForm }) => {
      try {
        const endpoint = isLogin ? "/auth/login" : "/auth/signup";

        // For login we only need email + password; for signup we send everything.
        const payload = isLogin
          ? { emailId: values.emailId, password: values.password }
          : values;

        const response = await fetch(`${apiBase}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.message || "Request failed");
          return;
        }

        if (isLogin) {
          // Store minimal profile in Redux; Protected routes rely on this auth state.
          dispatch(
            setUser({
              firstName: data?.data?.firstName,
              lastName: data?.data?.lastName,
            })
          );
          toast.success("Logged in successfully");
          resetForm();
          navigate("/dashboard");
        } else {
          toast.success("Account created. You can now log in.");
          setIsLogin(true);
          resetForm();
        }
      } catch (err) {
        console.error("Error: " + err.message);
        toast.error(err.message || "Something went wrong");
      }
    },
  });

  if (user) return null;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      {/* DaisyUI card + input components used below for a clean auth form UI. */}
      <form onSubmit={formik.handleSubmit}>
        <div className="card w-96 bg-base-100 shadow-2xl transition-all duration-300 hover:shadow-3xl border border-white/20">
          <div className="card-body">
            <h2 className="card-title text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2 justify-center">
              {isLogin ? "Welcome Back!" : "Create an Account"}
            </h2>

            {!isLogin && (
              <>
                <input
                  type="text"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  placeholder="First name"
                  className="input input-bordered w-full mt-2"
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="text-sm text-red-500">
                    {formik.errors.firstName}
                  </p>
                )}

                <input
                  type="text"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  placeholder="Last name"
                  className="input input-bordered w-full mt-3"
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="text-sm text-red-500">
                    {formik.errors.lastName}
                  </p>
                )}

                <input
                  type="url"
                  name="photoUrl"
                  value={formik.values.photoUrl}
                  onChange={formik.handleChange}
                  placeholder="https://"
                  className="input input-bordered w-full mt-3"
                  onBlur={formik.handleBlur}
                />
                {formik.touched.photoUrl && formik.errors.photoUrl && (
                  <p className="text-sm text-red-500">
                    {formik.errors.photoUrl}
                  </p>
                )}
              </>
            )}

            <input
              type="email"
              name="emailId"
              value={formik.values.emailId}
              onChange={formik.handleChange}
              placeholder="Email"
              className="input input-bordered w-full mt-3"
              onBlur={formik.handleBlur}
            />
            {formik.touched.emailId && formik.errors.emailId && (
              <p className="text-sm text-red-500">{formik.errors.emailId}</p>
            )}

            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              className="input input-bordered w-full mt-3"
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}

            <button type="submit" className="btn btn-primary mt-6 w-full shadow-lg hover:shadow-primary/50 transition-all rounded-full">
              {isLogin ? "Login" : "Sign up"}
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm mt-2 w-full"
              onClick={() => setIsLogin((prev) => !prev)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}