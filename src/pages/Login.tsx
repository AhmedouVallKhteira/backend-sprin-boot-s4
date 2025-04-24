import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AuthApi } from "../api/authService";
import "../styles/Auth.css";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loginWithTokensAndUser, user } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");
  const [modalError, setModalError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role == "USER") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const emailFromState = location.state?.email;
    const message = location.state?.messageLogin;

    if (emailFromState) setEmail(emailFromState);
    if (message) setInfoMessage(message);
  }, [location]);

  const handleSignIn = async (): Promise<void> => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await AuthApi.login({ email, motDePasse: password });
      loginWithTokensAndUser(response.data);
      if (response.data?.role == "USER") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Une erreur est survenue.");
      } else {
        setError("Une erreur inconnue s’est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    if (!resetEmail) {
      setModalError("Please enter your email to reset password.");
      return;
    }

    try {
      setResetLoading(true);
      setModalError("");
      const response = await AuthApi.forgotPassword({ email: resetEmail });
      setShowResetModal(false);
      navigate("/reset-password", {
        state: {
          email: resetEmail,
          messageLogin: response.data.message,
        },
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setModalError(
          err.response?.data?.message || "Une erreur est survenue."
        );
      } else {
        setModalError("Une erreur inconnue s’est produite.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Login</h2>

        {!showResetModal && (
          <>
            {error && <div className="auth-error">{error}</div>}
            {infoMessage && <div className="auth-success">{infoMessage}</div>}
          </>
        )}

        <div className="auth-input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="auth-input-group password-toggle-wrapper">
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleSignIn}
          className="auth-button"
          disabled={loading}
        >
          {loading ? <span className="spinner" /> : "Login"}
        </button>

        <div className="auth-footer">
          <button
            onClick={() => {
              setShowResetModal(true);
              setModalError("");
              setResetEmail("");
            }}
            className="auth-link"
            disabled={loading}
          >
            I forgot your password!
          </button>
        </div>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>

      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Reset password</h3>

            {modalError && <div className="auth-error">{modalError}</div>}

            <p className="modal-text">Enter your account's email address</p>
            <input
              type="email"
              placeholder="Email address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="modal-input"
              disabled={resetLoading}
            />
            <div className="modal-actions">
              <button
                onClick={() => setShowResetModal(false)}
                className="modal-cancel"
                disabled={resetLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                className="modal-continue"
                disabled={resetLoading}
              >
                {resetLoading ? <span className="spinner small" /> : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
