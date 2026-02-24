import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ChuckNorris from "./components/ChuckNorris";

function App() {
  const [token, setToken] = useState("null");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!token ? (
        <LoginForm setToken={setToken} />
      ) : (
        <ChuckNorris token={token} setToken={setToken} />
      )}
    </div>
  );
}

export default App;
