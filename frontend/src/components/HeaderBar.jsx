const roleLabelMap = {
  admin: 'Admin',
  manager: 'Manager',
  member: 'Member'
};

const HeaderBar = ({ user, onLogout }) => {
  const roleLabel = roleLabelMap[user?.role] || user?.role || 'Unknown';

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Logged In As</p>
        <h2>{user?.name}</h2>
      </div>

      <div className="badge-group">
        <span className="role-badge">{roleLabel}</span>
        <span className="country-badge">{user?.country}</span>
        <button className="logout-button" onClick={onLogout} type="button">
          Logout
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
