import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[error, setError] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await performLogin(email, password);
  }

  async function performLogin(username, password) {
    setError("");
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
      onLogin(data.uuid)
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
          type="text" 
          value={email}
          onChange={handleEmailChange}
          />
        </label>
        <br/>
        <label>Enter your password:
          <input 
          type="password"
          value={password}
          onChange={handlePasswordChange} 
          />
        </label>
        <br/>
        <input type="submit" value="Log In" />
      </form>
    </div>
  );
}
