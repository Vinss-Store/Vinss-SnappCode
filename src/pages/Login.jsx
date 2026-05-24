import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
      navigate("/dashboard");
    } else {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">

        <div className="login-logo">
          <div className="login-logo-icon">🔐</div>
          <h2>vinss-store.</h2>
          <p>Admin access only</p>
        </div>

        <form onSubmit={login}>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          >
            {loading ? "Masuk..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;
