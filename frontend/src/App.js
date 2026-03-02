import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ChuckNorris from "./components/ChuckNorris";
import "./App.css";

export default function App() {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token ? (
        <LoginForm onLogin={setToken} />
      ) : (
        <ChuckNorris token={token} setToken={setToken} />
      )}
    </div>
  );
}