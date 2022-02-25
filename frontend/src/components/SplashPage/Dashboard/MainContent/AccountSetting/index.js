import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./AccountSetting.css";
import { editUserInfo, changeUserPassword } from "../../../../../store/session";

const AccountSetting = ({ sessionUser }) => {
  const dispatch = useDispatch();
  const [errorsAccount, setErrorsAccount] = useState([]);
  const [errorsPassword, setErrorsPassword] = useState([]);
  const [showAccountSubmitBtn, setShowAccountSubmitBtn] = useState(false);
  const [showPasswordSubmitBtn, setShowPasswordSubmitBtn] = useState(false);
  const [username, setUsername] = useState(sessionUser.username);
  const [name, setName] = useState(sessionUser.name);
  const [email, setEmail] = useState(sessionUser.email);
  const [title, setTitle] = useState(sessionUser.title || '');
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setShowAccountSubmitBtn(false);
    if (username && name && email) {
      if (username !== sessionUser.username) setShowAccountSubmitBtn(true);
      if (name !== sessionUser.name) setShowAccountSubmitBtn(true);
      if (email !== sessionUser.email) setShowAccountSubmitBtn(true);
      if (title !== sessionUser.title) setShowAccountSubmitBtn(true);
    }
  }, [username, name, email, title]);

  useEffect(() => {
    setShowPasswordSubmitBtn(false);
    if (oldPassword && password && confirmPassword) setShowPasswordSubmitBtn(true);
  }, [oldPassword, password, confirmPassword]);

  const resetAccountForm = (e) => {
    e.preventDefault();
    setUsername(sessionUser.username);
    setName(sessionUser.name);
    setEmail(sessionUser.email);
    setTitle(sessionUser.title);
    setErrorsAccount([]);
  };

  const resetPasswordForm = (e) => {
    e.preventDefault();
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
    setErrorsPassword([]);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    console.log(email, username, name, title)
    dispatch(editUserInfo(sessionUser.id, {email: email.trim(), username: username.trim(), name: name.trim(), title: title.trim()}))
    .then(() => {
        setShowAccountSubmitBtn(false);
        setErrorsAccount([]);
    })
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrorsAccount(data.errors);
    });
  };

  const handleChangePassword = e => {
      e.preventDefault();
      if (password !== confirmPassword) {
        setErrorsPassword(['Password and confirm password must match.']);
        return;
      }
      dispatch(changeUserPassword(sessionUser.id, { oldPassword, password }))
      .then(() => {
        setShowPasswordSubmitBtn(false);
        setOldPassword('');
        setPassword('');
        setConfirmPassword('');
        setErrorsPassword([]);
    })
    .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrorsPassword(data.errors);
    });
  }

  return (
    <>
      <div className="main-content-title">
        <h2>Account settings</h2>
      </div>
      <div className="main-content-card account-settings">
        <form onSubmit={handleEdit}>
          <div className="input-container-username">
            <label htmlFor="edit-username-input">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container-name">
            <label htmlFor="edit-name-input">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-container-email">
            <label htmlFor="edit-email-input">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container-title">
            <label htmlFor="edit-title-input">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <ul>
            {errorsAccount.map((error, idx) => (
              <li className="error-message" key={idx}>
                {error}
              </li>
            ))}
          </ul>
          {showAccountSubmitBtn && (
            <div className="btn-group">
              <button
                className="cancel"
                type="button"
                onClick={resetAccountForm}
              >
                Discard changes
              </button>
              <button className="submit" type="submit">
                Save
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="main-content-title">
        <h2>Change password</h2>
      </div>
      <div className="main-content-card change-password">
        <form onSubmit={handleChangePassword}>
        <div className="input-container-oldpassword">
            <label htmlFor="edit-oldpassword-input">Old password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-container-password">
            <label htmlFor="edit-password-input">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-container-confirmpassword">
            <label htmlFor="edit-confirmpassword-input">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <ul>
            {errorsPassword.map((error, idx) => (
              <li className="error-message" key={idx}>
                {error}
              </li>
            ))}
          </ul>
          {showPasswordSubmitBtn && (
            <div className="btn-group">
              <button
                className="cancel"
                type="button"
                onClick={resetPasswordForm}
              >
                Discard changes
              </button>
              <button className="submit" type="submit">
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default AccountSetting;
