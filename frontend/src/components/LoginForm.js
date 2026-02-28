import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

    await performLogin(email.trim(), password);
  }

  async function performLogin(username, password) {
    setError("");
    setFieldErrors({});
    const response = await fetch('http://localhost:3000/login', {
      method: "POST",
      headers: {
        // Required for ExpressJS to parse body
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();

    if (response.ok && data.uuid) {
      onLogin(data.uuid);
      setPassword("");
      return;
    } 
    const msg = data?.message || (response.status === 401 ? "Invalid email or password." : `Login failed (${response.status}${response.statusText ? ` ${response.statusText}` : ""})`);
    setError(msg);
}

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <form onSubmit={handleSubmit}>
        <label>Enter your email:
          <input 
          type="email" 
          value={email}
          onChange={handleEmailChange}
          aria-invalid={Boolean(fieldErrors.email)}
          />
        </label>
        {fieldErrors.email && <p style={{ color: "#b00020", margin: "8px 0" }}>{fieldErrors.email}</p>}
        <br/>
        <label>Enter your password:
          <input 
          type="password"
          value={password}
          onChange={handlePasswordChange}
          aria-invalid={Boolean(fieldErrors.password)}
          />
        </label>
        {fieldErrors.password && <p style={{ color: "#b00020", margin: "8px 0" }}>{fieldErrors.password}</p>}
        <br/>
        {error && <p style={{ color: "#b00020", margin: "8px 0" }}>{error}</p>}
        <input type="submit" value="Log In" />
      </form>
    </div>
  );
}
