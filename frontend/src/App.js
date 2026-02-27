import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ChuckNorris from "./components/ChuckNorris";

export default function App() {
  const [token, setToken] = useState(null); // not "null"

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!token ? (
        <LoginForm onLogin={setToken} />
      ) : (
        <ChuckNorris token={token} setToken={setToken} />
      )}
    </div>
  );
}