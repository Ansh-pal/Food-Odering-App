import { useMemo, useState } from 'react';

const SEEDED_USERS = [
  { label: 'Nick Fury (Admin)', username: 'nick.fury', password: 'Pass@123' },
  { label: 'Captain Marvel (Manager - India)', username: 'captain.marvel', password: 'Pass@123' },
  { label: 'Captain America (Manager - America)', username: 'captain.america', password: 'Pass@123' },
  { label: 'Thanos (Member - India)', username: 'thanos', password: 'Pass@123' },
  { label: 'Thor (Member - India)', username: 'thor', password: 'Pass@123' },
  { label: 'Travis (Member - America)', username: 'travis', password: 'Pass@123' }
];

const defaultRegisterForm = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  country: 'India'
};

const LoginPanel = ({ isLoading, onLogin, onRegister }) => {
  const [selectedUsername, setSelectedUsername] = useState(SEEDED_USERS[0].username);
  const [authMode, setAuthMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [formError, setFormError] = useState('');

  const selectedUser = useMemo(
    () => SEEDED_USERS.find((user) => user.username === selectedUsername),
    [selectedUsername]
  );

  const resetError = () => setFormError('');

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setFormError('Enter both username and password.');
      return;
    }

    resetError();
    onLogin(loginForm.username.trim(), loginForm.password);
  };

  const handleDemoSubmit = (event) => {
    event.preventDefault();
    if (!selectedUser || isLoading) {
      return;
    }

    resetError();
    onLogin(selectedUser.username, selectedUser.password);
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    if (!registerForm.name.trim() || !registerForm.username.trim() || !registerForm.password.trim()) {
      setFormError('Fill in all required register fields.');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    resetError();
    onRegister({
      name: registerForm.name.trim(),
      username: registerForm.username.trim(),
      password: registerForm.password,
      country: registerForm.country
    });
  };

  const TabButton = ({ value, children }) => (
    <button
      type="button"
      className={`auth-tab ${authMode === value ? 'active' : ''}`}
      onClick={() => {
        setAuthMode(value);
        resetError();
      }}
      disabled={isLoading}
    >
      {children}
    </button>
  );

  const onLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const onRegisterInputChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  return (
    <section className="login-card" aria-label="Login panel">
      <h1>Food Ordering Portal</h1>

      <div className="auth-tabs" role="tablist" aria-label="Authentication modes">
        <TabButton value="login">Login</TabButton>
        <TabButton value="demo">Demo Login</TabButton>
        <TabButton value="register">Register</TabButton>
      </div>

      <p className="muted auth-help">
        Demo Login keeps the password hidden in the UI. Login and Register are the normal forms.
      </p>

      {authMode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="auth-form">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            name="username"
            type="text"
            value={loginForm.username}
            onChange={onLoginInputChange}
            placeholder="your.username"
            disabled={isLoading}
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={loginForm.password}
            onChange={onLoginInputChange}
            placeholder="Enter your password"
            disabled={isLoading}
          />

          {formError ? <p className="inline-error">{formError}</p> : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      ) : null}

      {authMode === 'demo' ? (
        <form onSubmit={handleDemoSubmit} className="auth-form">
          <label htmlFor="seeded-user">Seeded User</label>
          <select
            id="seeded-user"
            value={selectedUsername}
            onChange={(event) => setSelectedUsername(event.target.value)}
            disabled={isLoading}
          >
            {SEEDED_USERS.map((user) => (
              <option key={user.username} value={user.username}>
                {user.label}
              </option>
            ))}
          </select>

          <p className="demo-password-note">
            Password is hidden from the screen and automatically supplied for the selected seeded user.
          </p>

          {formError ? <p className="inline-error">{formError}</p> : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In with Demo User'}
          </button>
        </form>
      ) : null}

      {authMode === 'register' ? (
        <form onSubmit={handleRegisterSubmit} className="auth-form">
          <label htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            name="name"
            type="text"
            value={registerForm.name}
            onChange={onRegisterInputChange}
            placeholder="Your name"
            disabled={isLoading}
          />

          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            name="username"
            type="text"
            value={registerForm.username}
            onChange={onRegisterInputChange}
            placeholder="choose.a.username"
            disabled={isLoading}
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={registerForm.password}
            onChange={onRegisterInputChange}
            placeholder="Create a password"
            disabled={isLoading}
          />

          <label htmlFor="register-confirm-password">Confirm Password</label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            value={registerForm.confirmPassword}
            onChange={onRegisterInputChange}
            placeholder="Repeat password"
            disabled={isLoading}
          />

          <label htmlFor="register-country">Country</label>
          <select
            id="register-country"
            name="country"
            value={registerForm.country}
            onChange={onRegisterInputChange}
            disabled={isLoading}
          >
            <option value="India">India</option>
            <option value="America">America</option>
          </select>

          {formError ? <p className="inline-error">{formError}</p> : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      ) : null}
    </section>
  );
};

export default LoginPanel;
