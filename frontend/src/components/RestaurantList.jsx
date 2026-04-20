import { useState } from 'react';

const RestaurantList = ({
  restaurants,
  selectedRestaurantId,
  onSelectRestaurant,
  role,
  canManageRestaurants,
  onCreateRestaurant,
  onDeleteRestaurant
}) => {
  const [restaurantForm, setRestaurantForm] = useState({ name: '', country: 'India', cuisine: '' });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!restaurantForm.name.trim() || !restaurantForm.cuisine.trim()) {
      return;
    }

    onCreateRestaurant(restaurantForm);
    setRestaurantForm({ name: '', country: 'India', cuisine: '' });
  };

  return (
    <section className="panel-card">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Browse</p>
          <h3>Restaurants</h3>
        </div>
        <span className="panel-chip">{restaurants.length} visible</span>
      </div>

      {canManageRestaurants ? (
        <form className="inline-admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Restaurant name"
            value={restaurantForm.name}
            onChange={(event) => setRestaurantForm((current) => ({ ...current, name: event.target.value }))}
          />
          <input
            type="text"
            placeholder="Cuisine"
            value={restaurantForm.cuisine}
            onChange={(event) => setRestaurantForm((current) => ({ ...current, cuisine: event.target.value }))}
          />
          <select
            value={restaurantForm.country}
            onChange={(event) => setRestaurantForm((current) => ({ ...current, country: event.target.value }))}
          >
            <option value="India">India</option>
            <option value="America">America</option>
          </select>
          <button type="submit">Add Restaurant</button>
        </form>
      ) : null}

      <div className="restaurant-list">
        {restaurants.length === 0 ? (
          <p className="empty-state">No restaurants available for {role} in this country.</p>
        ) : (
          restaurants.map((restaurant) => {
            const isActive = restaurant._id === selectedRestaurantId;

            return (
              <div
                role="button"
                tabIndex={0}
                key={restaurant._id}
                className={`restaurant-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelectRestaurant(restaurant)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onSelectRestaurant(restaurant);
                  }
                }}
              >
                <div>
                  <h4>{restaurant.name}</h4>
                  <p className="muted small-text">{restaurant.cuisine}</p>
                </div>
                <div className="card-meta">
                  <span className="country-badge">{restaurant.country}</span>
                  <span className="small-text">{restaurant.menu?.length || 0} items</span>
                </div>
                {canManageRestaurants ? (
                  <div className="row-actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteRestaurant(restaurant);
                      }}
                    >
                      Delete Restaurant
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RestaurantList;
