"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  CalendarDays,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

import { registerUser } from "@/app/services/authService";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear password mismatch error while typing
    if (
      name === "password" ||
      name === "confirmPassword"
    ) {
      setError("");
    }
  }

  function selectGender(gender) {
    setForm((prev) => ({
      ...prev,
      gender,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Frontend validation
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }

    if (!form.gender) {
      setError("Please select your gender.");
      return;
    }

    if (!form.mobile || form.mobile.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (!form.confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    // Password matching
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError(
        "Please accept the Terms of Service and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      // Don't send confirmPassword to backend
      const { confirmPassword, ...registrationData } = form;
      console.log("Registration data:", registrationData);
      const response = await registerUser(registrationData);
      console.log("Registration response:", response);
      if (response.success) {
        console.log("User registered successfully:", response);
        router.push(
          `/verify-otp?userId=${response.userId}`
        );
      }
    } catch (error) {
      setError(
        error?.message + "  Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f9fd] px-4 py-6 sm:px-6 lg:flex lg:items-center lg:justify-center lg:py-10">
      <div className="mx-auto w-full max-w-md lg:max-w-4xl">

        {/* Card */}
        <div className="rounded-[28px] bg-white px-5 py-7 shadow-sm sm:px-8 sm:py-9 lg:px-10 lg:py-10">

          {/* Heading */}
          <div className="mb-7 lg:mb-8">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Create Your Account
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500 sm:text-base">
              Join SwasthLink to manage your health
              records securely.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2"
          >

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Full Name *
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500">
                <UserRound
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Date of Birth *
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500">
                <CalendarDays
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Gender *
              </label>

              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-200">

                {[
                  ["MALE", "Male"],
                  ["FEMALE", "Female"],
                  ["OTHER", "Other"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => selectGender(value)}
                    className={`py-3 text-sm transition ${
                      form.gender === value
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}

              </div>
            </div>

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

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Email Address (Optional)
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500">
                <Mail
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Password *
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 px-3 transition focus-within:border-blue-500">
                <Lock
                  size={18}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
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

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm text-slate-500">
                Confirm Password *
              </label>

              <div
                className={`flex items-center rounded-xl border px-3 transition focus-within:border-blue-500 ${
                  form.confirmPassword &&
                  form.password !== form.confirmPassword
                    ? "border-red-400"
                    : "border-slate-200"
                }`}
              >
                <Lock
                  size={18}
                  className={`shrink-0 ${
                    form.confirmPassword &&
                    form.password !== form.confirmPassword
                      ? "text-red-500"
                      : "text-slate-500"
                  }`}
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="text-slate-500 hover:text-slate-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* Password mismatch */}
              {form.confirmPassword &&
                form.password !==
                  form.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Passwords do not match.
                  </p>
                )}

              {/* Password matched */}
              {form.confirmPassword &&
                form.password ===
                  form.confirmPassword && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
                    <Check size={13} />
                    Passwords match.
                  </p>
                )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 lg:col-span-2">
              <button
                type="button"
                onClick={() =>
                  setAgreed((prev) => !prev)
                }
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                  agreed
                    ? "bg-blue-600"
                    : "border border-slate-300"
                }`}
              >
                {agreed && (
                  <Check
                    size={11}
                    className="text-white"
                  />
                )}
              </button>

              <p className="text-xs leading-5 text-slate-500">
                By creating an account, you agree to our{" "}
                <span className="text-blue-600">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-600">
                  Privacy Policy
                </span>
                .
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 lg:col-span-2">
                {error}
              </div>
            )}

            {/* Register Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Register"}
              </button>
            </div>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </main>
  );
}