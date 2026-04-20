const OrdersTable = ({ orders }) => {
  return (
    <section className="panel-card full-width-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">History</p>
          <h3>Orders</h3>
        </div>
        <span className="panel-chip">{orders.length} loaded</span>
      </div>

      {orders.length === 0 ? (
        <p className="empty-state">No orders found yet.</p>
      ) : (
        <div className="orders-table">
          <div className="orders-table-header">
            <span>ID</span>
            <span>Restaurant</span>
            <span>Country</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          {orders.map((order) => (
            <div className="orders-table-row" key={order._id}>
              <span className="mono-cell">{order._id.slice(-6)}</span>
              <span>{order.restaurantId?.name || 'Unknown'}</span>
              <span>{order.country}</span>
              <span className={`status-pill status-${order.status}`}>{order.status}</span>
              <span>${order.totalAmount}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersTable;
