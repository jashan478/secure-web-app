import { useState, useEffect } from "react";
import { API_BASE } from "../config";

export default function ChuckNorris({ token, setToken }) {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFact() {
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/fact`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            setToken(null);
            setError("Session expired. Please log in again.");
          } else {
            setError(data?.message || "Failed to fetch fact.");
          }
          return;
        }

        setFact(data.fact || "");
      } catch {
        setError("Network error. Could not reach the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchFact();
  }, [token, setToken]);

  // 🔹 Logout handler (Person 5 responsibility)
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } finally {
      setToken(null); // clear token + redirect to login
    }
  };

  return (
    <div className="container">
      <h2>Chuck Norris Fact</h2>

      {loading && <div className="spinner" />}

      {error && (
        <p style={{ color: "#b00020", marginTop: "16px" }}>{error}</p>
      )}

      {!loading && !error && (
        <div className="fact-box">
          {fact}
        </div>
      )}

      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}