import { useEffect, useMemo, useState } from 'react';
import './App.css';
import LoginPanel from './components/LoginPanel';
import HeaderBar from './components/HeaderBar';
import RestaurantList from './components/RestaurantList';
import MenuList from './components/MenuList';
import CartPanel from './components/CartPanel';
import OrdersTable from './components/OrdersTable';
import PaymentMethodPanel from './components/PaymentMethodPanel';
import FeatureSummary from './components/FeatureSummary';
import { apiClient } from './api/client';
import { useAuth } from './hooks/useAuth';

const emptyPaymentForm = {
  type: 'card',
  provider: '',
  last4: ''
};

const getOrderRestaurantId = (order) => order?.restaurantId?._id || order?.restaurantId || '';

function App() {
  const { token, user, isAuthenticated, setSession, clearSession } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [globalMessage, setGlobalMessage] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [activeOrderId, setActiveOrderId] = useState('');
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant._id === selectedRestaurantId) || null,
    [restaurants, selectedRestaurantId]
  );

  const activeOrder = useMemo(() => {
    return orders.find((order) => order._id === activeOrderId) || null;
  }, [orders, activeOrderId]);

  const cartItems = activeOrder?.items || [];
  const orderTotal = activeOrder?.totalAmount || 0;

  const canCreateOrder = Boolean(selectedRestaurant);
  const canAddItems = Boolean(
    activeOrder &&
      selectedRestaurant &&
      getOrderRestaurantId(activeOrder) === selectedRestaurant._id &&
      activeOrder.status === 'draft'
  );
  const canCheckout = Boolean(activeOrder && ['admin', 'manager'].includes(user?.role) && activeOrder.status === 'draft');
  const canCancel = Boolean(activeOrder && ['admin', 'manager'].includes(user?.role) && activeOrder.status === 'placed');

  useEffect(() => {
    if (user?.paymentMethod) {
      setPaymentForm({
        type: user.paymentMethod.type || 'card',
        provider: user.paymentMethod.provider || '',
        last4: user.paymentMethod.last4 || ''
      });
      return;
    }

    setPaymentForm(emptyPaymentForm);
  }, [user]);

  const loadResources = async (sessionToken) => {
    const [restaurantResponse, orderResponse] = await Promise.all([
      apiClient.getRestaurants(sessionToken, true),
      apiClient.getOrders(sessionToken)
    ]);

    const nextRestaurants = restaurantResponse.data || [];
    const nextOrders = orderResponse.data || [];

    setRestaurants(nextRestaurants);
    setOrders(nextOrders);

    const nextSelectedRestaurant =
      nextRestaurants.find((restaurant) => restaurant._id === selectedRestaurantId) || nextRestaurants[0] || null;

    const nextSelectedRestaurantId = nextSelectedRestaurant?._id || '';
    setSelectedRestaurantId(nextSelectedRestaurantId);

    const draftForSelected = nextOrders.find(
      (order) => order.status === 'draft' && getOrderRestaurantId(order) === nextSelectedRestaurantId
    );

    setActiveOrderId(draftForSelected?._id || '');
  };

  const loadDashboard = async (sessionToken) => {
    setIsLoading(true);
    setGlobalError('');

    try {
      const profileResponse = await apiClient.getProfile(sessionToken);
      setSession(sessionToken, profileResponse.user);
      await loadResources(sessionToken);
      setGlobalMessage('Dashboard loaded with role-aware data.');
    } catch (error) {
      setGlobalError(error.message);
      setGlobalMessage('');
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setRestaurants([]);
      setOrders([]);
      setSelectedRestaurantId('');
      setActiveOrderId('');
      setPaymentForm(emptyPaymentForm);
      setGlobalError('');
      setGlobalMessage('');
      return;
    }

    loadDashboard(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const authResponse = await apiClient.login(username, password);
      setSession(authResponse.token, authResponse.user);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async ({ name, username, password, country }) => {
    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const authResponse = await apiClient.register({ name, username, password, country });
      setSession(authResponse.token, authResponse.user);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setGlobalError('');
    setGlobalMessage('');
  };

  const refreshDashboard = async () => {
    if (!token) {
      return;
    }

    try {
      await loadDashboard(token);
      setGlobalMessage('Dashboard refreshed.');
    } catch (error) {
      setGlobalError(error.message);
    }
  };

  const handleCreateRestaurant = async (restaurant) => {
    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      await apiClient.createRestaurant(token, restaurant);
      await refreshDashboard();
      setGlobalMessage('Restaurant created successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRestaurant = async (restaurant) => {
    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      await apiClient.deleteRestaurant(token, restaurant._id);
      await refreshDashboard();
      setGlobalMessage('Restaurant deleted successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMenuItem = async (restaurantId, menuItem) => {
    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      await apiClient.createMenuItem(token, restaurantId, menuItem);
      await refreshDashboard();
      setGlobalMessage('Dish added successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenuItem = async (restaurantId, menuItem) => {
    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      await apiClient.deleteMenuItem(token, restaurantId, menuItem._id);
      await refreshDashboard();
      setGlobalMessage('Dish deleted successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurantId(restaurant._id);

    const matchingDraft = orders.find(
      (order) => order.status === 'draft' && getOrderRestaurantId(order) === restaurant._id
    );

    setActiveOrderId(matchingDraft?._id || '');
    setGlobalMessage(`Viewing ${restaurant.name}.`);
    setGlobalError('');
  };

  const handleCreateOrder = async () => {
    if (!selectedRestaurant) {
      setGlobalError('Select a restaurant before creating an order.');
      return;
    }

    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const response = await apiClient.createOrder(token, selectedRestaurant._id);
      const nextOrder = response.data;

      setOrders((currentOrders) => [nextOrder, ...currentOrders.filter((order) => order._id !== nextOrder._id)]);
      setActiveOrderId(nextOrder._id);
      setGlobalMessage('Draft order created. You can now add menu items.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (menuItem) => {
    if (!activeOrder) {
      setGlobalError('Create a draft order before adding items.');
      return;
    }

    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const response = await apiClient.addOrderItem(token, activeOrder._id, menuItem._id, 1);
      const nextOrder = response.data;

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order._id === nextOrder._id ? nextOrder : order))
      );
      setActiveOrderId(nextOrder._id);
      setGlobalMessage(`${menuItem.name} added to cart.`);
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!activeOrder) {
      setGlobalError('Create a draft order first.');
      return;
    }

    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const response = await apiClient.checkoutOrder(token, activeOrder._id);
      const nextOrder = response.data;

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order._id === nextOrder._id ? nextOrder : order))
      );
      setActiveOrderId(nextOrder._id);
      setGlobalMessage('Order placed successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!activeOrder) {
      setGlobalError('Select a placed order before canceling.');
      return;
    }

    setIsLoading(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const response = await apiClient.cancelOrder(token, activeOrder._id);
      const nextOrder = response.data;

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order._id === nextOrder._id ? nextOrder : order))
      );
      setActiveOrderId(nextOrder._id);
      setGlobalMessage('Order cancelled successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!user || user.role !== 'admin') {
      setGlobalError('Only admin can update payment method.');
      return;
    }

    setIsSavingPayment(true);
    setGlobalError('');
    setGlobalMessage('');

    try {
      const response = await apiClient.updatePaymentMethod(token, user.id, paymentForm);
      setSession(token, response.data);
      setPaymentForm({
        type: response.data.paymentMethod?.type || 'card',
        provider: response.data.paymentMethod?.provider || '',
        last4: response.data.paymentMethod?.last4 || ''
      });
      setGlobalMessage('Payment method updated successfully.');
    } catch (error) {
      setGlobalError(error.message);
    } finally {
      setIsSavingPayment(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="aurora" aria-hidden="true" />
      <main className="content-wrap">
        {isAuthenticated ? (
          <section className="dashboard-card">
            <HeaderBar user={user} onLogout={handleLogout} />

            {globalError ? <p className="toast-message error-toast">{globalError}</p> : null}
            {globalMessage ? <p className="toast-message success-toast">{globalMessage}</p> : null}

            <FeatureSummary user={user} onRefresh={refreshDashboard} />

            <section className="dashboard-grid" aria-label="Ordering workspace">
              <RestaurantList
                restaurants={restaurants}
                selectedRestaurantId={selectedRestaurantId}
                onSelectRestaurant={handleSelectRestaurant}
                role={user?.role}
                canManageRestaurants={['admin', 'manager'].includes(user?.role)}
                onCreateRestaurant={handleCreateRestaurant}
                onDeleteRestaurant={handleDeleteRestaurant}
              />
              <MenuList
                restaurant={selectedRestaurant}
                menuItems={selectedRestaurant?.menu || []}
                onAddItem={handleAddItem}
                canAddItems={canAddItems}
                canManageMenu={['admin', 'manager'].includes(user?.role) && Boolean(selectedRestaurant)}
                onCreateMenuItem={handleCreateMenuItem}
                onDeleteMenuItem={handleDeleteMenuItem}
              />
              <CartPanel
                cartItems={cartItems}
                orderTotal={orderTotal}
                onCreateOrder={handleCreateOrder}
                onCheckout={handleCheckout}
                onCancelOrder={handleCancelOrder}
                canCheckout={canCheckout}
                canCancel={canCancel}
                canCreateOrder={canCreateOrder}
                activeOrder={activeOrder}
                selectedRestaurant={selectedRestaurant}
              />
              <OrdersTable orders={orders} />
              <PaymentMethodPanel
                user={user}
                form={paymentForm}
                onChange={handlePaymentChange}
                onSubmit={handlePaymentSubmit}
                isSaving={isSavingPayment}
              />
            </section>

            {isLoading ? <p className="muted loading-inline">Syncing with server...</p> : null}
            <div className="actions-row">
              <button type="button" onClick={refreshDashboard}>
                Refresh Data
              </button>
            </div>
          </section>
        ) : (
          <>
            <LoginPanel isLoading={isLoading} onLogin={handleLogin} onRegister={handleRegister} />
            {globalError ? <p className="toast-message error-toast login-toast">{globalError}</p> : null}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
