const PaymentMethodPanel = ({ user, form, onChange, onSubmit, isSaving }) => {
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <section className="panel-card full-width-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Admin Only</p>
          <h3>Update Payment Method</h3>
        </div>
        <span className="panel-chip">{user.username}</span>
      </div>

      <form className="payment-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <label>
            Type
            <select name="type" value={form.type} onChange={onChange}>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
            </select>
          </label>

          <label>
            Provider
            <input type="text" name="provider" value={form.provider} onChange={onChange} placeholder="Visa" />
          </label>

          <label>
            Last 4
            <input type="text" name="last4" maxLength="4" value={form.last4} onChange={onChange} placeholder="1234" />
          </label>
        </div>

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Update Payment Method'}
        </button>
      </form>
    </section>
  );
};

export default PaymentMethodPanel;
