const FeatureSummary = ({ user, onRefresh, refreshText = 'Refresh Data' }) => {
  const permissions = {
    canCheckout: user?.role === 'admin' || user?.role === 'manager',
    canCancel: user?.role === 'admin' || user?.role === 'manager',
    canUpdatePayment: user?.role === 'admin',
    scopedCountry: user?.role === 'admin' ? 'All countries' : user?.country
  };

  return (
    <section className="panel-card full-width-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Access</p>
          <h3>Role-aware controls</h3>
        </div>
        <button type="button" onClick={onRefresh}>
          {refreshText}
        </button>
      </div>

      <div className="summary-grid">
        <article className="summary-tile">
          <span>Scope</span>
          <strong>{permissions.scopedCountry}</strong>
        </article>
        <article className="summary-tile">
          <span>Checkout</span>
          <strong>{permissions.canCheckout ? 'Allowed' : 'Blocked'}</strong>
        </article>
        <article className="summary-tile">
          <span>Cancel</span>
          <strong>{permissions.canCancel ? 'Allowed' : 'Blocked'}</strong>
        </article>
        <article className="summary-tile">
          <span>Payment Update</span>
          <strong>{permissions.canUpdatePayment ? 'Allowed' : 'Blocked'}</strong>
        </article>
      </div>
    </section>
  );
};

export default FeatureSummary;
