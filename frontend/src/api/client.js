const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

const buildHeaders = (token, extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
};

const request = async (path, { method = 'GET', token, body } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(token),
    body: body ? JSON.stringify(body) : undefined
  });

  return parseResponse(response);
};

export const apiClient = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ username, password })
    });

    return parseResponse(response);
  },

  register: async ({ name, username, password, country }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ name, username, password, country })
    });

    return parseResponse(response);
  },

  getProfile: async (token) => {
    return request('/auth/me', { token });
  },

  getRestaurants: async (token, includeMenu = true) => {
    return request(`/restaurants?includeMenu=${includeMenu ? 'true' : 'false'}`, { token });
  },

  createRestaurant: async (token, restaurant) => {
    return request('/restaurants', {
      method: 'POST',
      token,
      body: restaurant
    });
  },

  deleteRestaurant: async (token, restaurantId) => {
    return request(`/restaurants/${restaurantId}`, {
      method: 'DELETE',
      token
    });
  },

  createMenuItem: async (token, restaurantId, menuItem) => {
    return request(`/restaurants/${restaurantId}/menu-items`, {
      method: 'POST',
      token,
      body: menuItem
    });
  },

  deleteMenuItem: async (token, restaurantId, menuItemId) => {
    return request(`/restaurants/${restaurantId}/menu-items/${menuItemId}`, {
      method: 'DELETE',
      token
    });
  },

  createOrder: async (token, restaurantId) => {
    return request('/orders', {
      method: 'POST',
      token,
      body: { restaurantId }
    });
  },

  addOrderItem: async (token, orderId, menuItemId, quantity) => {
    return request(`/orders/${orderId}/items`, {
      method: 'POST',
      token,
      body: { menuItemId, quantity }
    });
  },

  checkoutOrder: async (token, orderId) => {
    return request(`/orders/${orderId}/checkout`, {
      method: 'POST',
      token
    });
  },

  cancelOrder: async (token, orderId) => {
    return request(`/orders/${orderId}/cancel`, {
      method: 'POST',
      token
    });
  },

  getOrders: async (token) => {
    return request('/orders', { token });
  },

  updatePaymentMethod: async (token, userId, paymentMethod) => {
    return request(`/users/${userId}/payment-method`, {
      method: 'PATCH',
      token,
      body: paymentMethod
    });
  }
};

export { API_BASE_URL };
