"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { loginUser } from "@/app/services/authService";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Mobile validation
    if (!form.mobile) {
      setError("Mobile number is required.");
      return;
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    // Password validation
    if (!form.password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      const loginData = {
        mobile: form.mobile,
        password: form.password,
      };

      console.log("Login data:", loginData);

      const response = await loginUser(loginData);

      console.log("Login response:", response);

      if (response.success) {
        // Temporary:
        // Login successful
        console.log("User logged in successfully");

        // Example:
        // localStorage.setItem("token", response.token);

        router.push("/user");
      } else {
        setError(response.message || "Login failed.");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f9fd] px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-[28px] bg-white px-5 py-8 shadow-sm sm:px-8 sm:py-10">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm leading-5 text-slate-500 sm:text-base">
              Login to your SwasthLink account.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Mobile */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Mobile Number *
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500">
                <Phone
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder="Enter mobile number"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm text-slate-500">
                  Password *
                </label>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/forgot-password")
                  }
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500">
                <Lock
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}

            <button
              type="button"
              onClick={() =>
                router.push("/register")
              }
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create Account
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}