// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { resetPassword } from "../api/authService";
// import "../styles/Auth.css";

// export function OtpResetPage(): React.ReactElement {
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleReset = () => {
//     if (!email || !otp || !newPassword || !confirmPassword) {
//       setError("All fields are required");
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }
//     setError("");
//     resetPassword({ email, otp: parseInt(otp), newPassword })
//       .then(() => {
//         setSuccess("Password reset successfully");
//         setTimeout(() => navigate("/login"), 1500);
//       })
//       .catch(() => setError("Invalid OTP or email"));
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-box">
//         <h2 className="auth-title">Reset Password with OTP</h2>

//         {error && <div className="auth-error">{error}</div>}
//         {success && <div className="auth-success">{success}</div>}

//         <div className="auth-input-group">
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="your@email.com"
//           />
//         </div>

//         <div className="auth-input-group">
//           <label>OTP Code</label>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             placeholder="Enter the code"
//           />
//         </div>

//         <div className="auth-input-group">
//           <label>New Password</label>
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             placeholder="Enter new password"
//           />
//         </div>

//         <div className="auth-input-group">
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             placeholder="Confirm new password"
//           />
//         </div>

//         <button onClick={handleReset} className="auth-button">
//           Confirm Reset
//         </button>
//       </div>
//     </div>
//   );
// }
