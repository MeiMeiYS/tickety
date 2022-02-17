import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <div className="login-page-content">
      <div className="login-form-box">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container-username-or-email">
            <label>
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="username or email"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                />
            </label>
          </div>
          <div className="input-container-password">
            <label>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </label>
          </div>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx} className="error-message">{error}</li>
            ))}
          </ul>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
