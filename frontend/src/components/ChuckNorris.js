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
      } catch (err) {
        setError("Network error. Could not reach the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchFact();
  }, [token, setToken]);

  if (loading) {
    return <p>Loading fact...</p>;
  }

  if (error) {
    return <p style={{ color: "#b00020" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Chuck Norris Fact</h2>
      <p style={{ maxWidth: "600px", margin: "20px auto", lineHeight: 1.6 }}>
        {fact}
      </p>
    </div>
  );
}
