import { useState } from "react";
import axios from "axios";
import "./ResetPasswordScreen.css";

const ResetPasswordScreen = ({ match, history }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);

      return setError("Passwords do not match!!");
    }

    try {
      const { data } = await axios.put(
        `/api/auth/reset-password/${match.params.resetToken}`,
        { password },
        config
      );

      setSuccess(data.data);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        history.push("/login");
      }, 2000);
    } catch (error) {
      setError(error.response.data.error);
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="reset-password-screen">
      <form
        className="reset-password-screen__form"
        onSubmit={resetPasswordHandler}
      >
        <h3 className="reset-password-screen__title">Update Password</h3>
        {error && <span className="error-message">{error}</span>}
        {success && <span className="success-message">{success}</span>}
        <div className="form-group">
          <label htmlFor="password">New password</label>
          <input
            type="password"
            required
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            required
            id="confirm-password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordScreen;
