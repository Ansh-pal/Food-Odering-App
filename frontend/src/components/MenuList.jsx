import { useState } from 'react';

const MenuList = ({ restaurant, menuItems, onAddItem, canAddItems, canManageMenu, onCreateMenuItem, onDeleteMenuItem }) => {
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!restaurant) {
      return;
    }

    onCreateMenuItem(restaurant._id, menuForm);
    setMenuForm({ name: '', description: '', price: '' });
  };

  return (
    <section className="panel-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Order</p>
          <h3>{restaurant ? `${restaurant.name} Menu` : 'Menu Items'}</h3>
        </div>
        {!canAddItems ? <span className="panel-chip muted-chip">Create a draft order first</span> : null}
      </div>

      {canManageMenu && restaurant ? (
        <form className="inline-admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Dish name"
            value={menuForm.name}
            onChange={(event) => setMenuForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Description"
            value={menuForm.description}
            onChange={(event) => setMenuForm((current) => ({ ...current, description: event.target.value }))}
          />
          <input
            type="number"
            min="0"
            placeholder="Price"
            value={menuForm.price}
            onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))}
          />
          <button type="submit">Add Dish</button>
        </form>
      ) : null}

      {!restaurant ? (
        <p className="empty-state">Select a restaurant to inspect its menu.</p>
      ) : menuItems.length === 0 ? (
        <p className="empty-state">This restaurant currently has no available items.</p>
      ) : (
        <div className="menu-list">
          {menuItems.map((item) => (
            <article className="menu-item-card" key={item._id}>
              <div>
                <h4>{item.name}</h4>
                <p className="muted small-text">{item.description}</p>
              </div>
              <div className="menu-item-footer">
                <strong>${item.price}</strong>
                <div className="row-actions">
                  <button type="button" onClick={() => onAddItem(item)} disabled={!canAddItems}>
                    Add to Cart
                  </button>
                  {canManageMenu ? (
                    <button type="button" className="secondary-button" onClick={() => onDeleteMenuItem(restaurant._id, item)}>
                      Delete Dish
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MenuList;
