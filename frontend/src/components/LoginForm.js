import { useState } from "react";
import { API_BASE } from "../config";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validateInputs(currentEmail, currentPassword) {
    const errors = {};
    const emailValue = currentEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(emailValue)) {
      errors.email = "Enter a valid email address (example@domain.com).";
    }

    if (!currentPassword) {
      errors.password = "Password is required.";
    } else if (currentPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  }

  function handleEmailChange(e) {
    const nextEmail = e.target.value;
    setEmail(nextEmail);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
  }

  function handlePasswordChange(e) {
    const nextPassword = e.target.value;
    setPassword(nextPassword);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateInputs(email, password);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    await performLogin(email.trim(), password);
    setSubmitting(false);
  }

  async function performLogin(username, password) {
    setError("");
    setFieldErrors({});

    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.uuid) {
      onLogin(data.uuid);
      setPassword("");
      return;
    }

    const msg =
      data?.message ||
      (response.status === 401
        ? "Invalid email or password."
        : `Login failed (${response.status})`);

    setError(msg);
  }

  return (
    <div className="container">
      <h1>Login</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "16px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            aria-invalid={Boolean(fieldErrors.email)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
          {fieldErrors.email && (
            <p style={{ color: "#b00020" }}>{fieldErrors.email}</p>
          )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            aria-invalid={Boolean(fieldErrors.password)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
          {fieldErrors.password && (
            <p style={{ color: "#b00020" }}>{fieldErrors.password}</p>
          )}
        </div>

        {error && <p style={{ color: "#b00020" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}