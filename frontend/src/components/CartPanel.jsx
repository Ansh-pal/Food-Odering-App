const CartPanel = ({
  cartItems,
  orderTotal,
  onCreateOrder,
  onCheckout,
  onCancelOrder,
  canCheckout,
  canCancel,
  canCreateOrder,
  activeOrder,
  selectedRestaurant
}) => {
  return (
    <section className="panel-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Basket</p>
          <h3>Cart Summary</h3>
        </div>
        <span className="panel-chip">{cartItems.length} lines</span>
      </div>

      <div className="draft-banner">
        <p className="muted small-text">
          {selectedRestaurant
            ? `Restaurant: ${selectedRestaurant.name} (${selectedRestaurant.country})`
            : 'Select a restaurant to start a draft order.'}
        </p>
        <p className="muted small-text">
          {activeOrder ? `Draft order ${activeOrder._id.slice(-6)} is active.` : 'No draft order active yet.'}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-state">Your draft order is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-row" key={item.menuItemId}>
              <div>
                <strong>{item.name}</strong>
                <p className="muted small-text">
                  {item.quantity} x ${item.unitPrice}
                </p>
              </div>
              <strong>${item.lineTotal}</strong>
            </div>
          ))}
        </div>
      )}

      <div className="cart-footer">
        <div>
          <p className="muted small-text">Order total</p>
          <h2>${orderTotal}</h2>
        </div>
        <div className="cart-actions">
          <button type="button" onClick={onCreateOrder} disabled={!canCreateOrder}>
            Create Draft Order
          </button>
          <button type="button" onClick={onCheckout} disabled={!canCheckout}>
            Checkout & Pay
          </button>
          <button type="button" onClick={onCancelOrder} disabled={!canCancel} className="secondary-button">
            Cancel Order
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartPanel;
