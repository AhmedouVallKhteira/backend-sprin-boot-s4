import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authService";
import "../styles/Auth.css";
import axios from "axios";
import NotFound from "./NotFound";

export default function ActivateAccountPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [infoMessage, setInfoMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const type = "register";

  useEffect(() => {
    const stateEmail = location.state?.email;

    if (!stateEmail) return;

    setEmail(stateEmail);
    setInfoMessage(
      `We have sent a confirmation code to your email: ${stateEmail}`
    );
  }, [location]);

  if (!location.state?.email) {
    return <NotFound />;
  }

  const isBusy = loading || resending;

  const handleActivate = async (): Promise<void> => {
    if (!otp) {
      setError("Please enter the OTP code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const numericOtp = parseInt(otp, 10);
      await AuthApi.activateAccount({ email, otp: numericOtp });

      setSuccess("Account activated successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login", {
          state: {
            email,
            statusLogin: true,
            messageLogin: "Your account has been activated. Please log in.",
          },
        });
      }, 0);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Activation failed. Please try again."
        );
      } else {
        setError("Activation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    try {
      setResending(true);
      setError("");
      setSuccess("");
      await AuthApi.resendOtp({ email, type });
      setInfoMessage(`A new OTP code has been sent to: ${email}`);
    } catch {
      setError("Failed to resend OTP. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Activate Account</h2>
        {error ? (
          <div className="auth-error">{error}</div>
        ) : success ? (
          <div className="auth-success">{success}</div>
        ) : infoMessage ? (
          <div className="auth-info">{infoMessage}</div>
        ) : null}

        <div className="auth-input-group">
          <label>OTP Code</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isBusy}
          />
        </div>

        <button
          onClick={handleActivate}
          className="auth-button"
          disabled={isBusy}
        >
          {loading ? <span className="spinner" /> : "Activate"}
        </button>

        <div className="auth-footer">
          <button
            onClick={handleResendOtp}
            className="auth-link"
            disabled={isBusy}
          >
            {resending ? <span className="spinner small" /> : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
