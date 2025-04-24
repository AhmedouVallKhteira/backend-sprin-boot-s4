import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/authService";
import "../styles/Auth.css";
import axios from "axios";
import NotFound from "./NotFound";

export default function ResetPasswordPage(): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const stateEmail = location.state?.email;
    if (!stateEmail) return;
    setEmail(stateEmail);
    setSuccess(
      `We have sent a confirmation code to your email: ${stateEmail}`
    );
  }, [location]);

  if (!location.state?.email) {
    return <NotFound />;
  }

  const isBusy = loading || resending;

  const handleReset = async (): Promise<void> => {
    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const numericOtp = parseInt(otp, 10);
      await AuthApi.resetPassword({
        email,
        otp: numericOtp,
        newPassword,
      });

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", {
          state: {
            email,
            messageLogin: "Password reset successful. Please log in.",
          },
        });
      }, 0);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Reset failed. Try again.");
      } else {
        setError("Unexpected error occurred.");
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
      await AuthApi.resendOtp({ email, type: "reset" });
      setSuccess(`A new OTP code has been sent to: ${email}`);
    } catch {
      setError("Failed to resend OTP. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Reset Password</h2>

        {error ? (
          <div className="auth-error">{error}</div>
        ) : success ? (
          <div className="auth-info">{success}</div>
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

        <div className="auth-input-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isBusy}
          />
        </div>

        <div className="auth-input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isBusy}
          />
        </div>

        <button onClick={handleReset} className="auth-button" disabled={isBusy}>
          {loading ? <span className="spinner" /> : "Reset Password"}
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
