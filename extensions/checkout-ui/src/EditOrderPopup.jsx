import React, { useState, useEffect } from 'react';

const EditOrderPopup = ({ order, onClose, updateOrder }) => {
  const [items, setItems] = useState([]); // Stores order items with editable quantities and variants

  // Function to handle quantity updates
  const handleQuantityChange = (itemId, newQuantity) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Function to handle variant selection
  const handleVariantChange = (itemId, newVariantId) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, variantId: newVariantId } : item))
    );
  };

  // Function to handle item deletion
  const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Function to submit updated order information (implementation details omitted)
  const submitUpdatedOrder = async () => {
    // Implement logic to send a POST request to your Laravel endpoint with the updated items array
    // This might involve using libraries like Axios or the Fetch API.
    // The Laravel endpoint should handle updating the order data accordingly.

    // Example with Axios (assuming a Laravel endpoint at 'http://your-laravel-app.com/api/orders/update')
    try {
      const response = await axios.post('http://your-laravel-app.com/api/orders/update', {
        orderId: order.id,
        updatedItems: items,
      });
      if (response.data.success) {
        onClose(); // Close the popup on successful update
        // Handle success message or notification (optional)
      } else {
        console.error('Error updating order:', response.data.error); // Handle errors
      }
    } catch (error) {
      console.error('Error submitting updated order:', error); // Handle errors
    }
  };

  useEffect(() => {
    if (order) {
      setItems(
        order.lineItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          variants: item.variants.edges.map((variant) => ({
            id: variant.node.id,
            title: variant.node.title,
          })),
          variantId: item.variantId, // Assuming variantId exists in the data
        }))
      );
    }
  }, [order]);

  const closePopup = () => {
    onClose();
  };

  return (
    <div className="edit-order-popup">
      <h2>Edit Your Order</h2>
      <p>Update quantities, variants, or remove items from your order.</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
            />
            {item.variants && item.variants.length > 1 && (
              <select value={item.variantId} onChange={(e) => handleVariantChange(item.id, e.target.value)}>
                {item.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.variant.title}
                  </option>
                ))}
              </select>
            )}
            <button onClick={() => handleDeleteItem(item.id)}>Remove Item</button>
          </li>
        ))}
      </ul>
      <div className="popup-actions">
        <button onClick={closePopup}>Close</button>
        <button onClick={submitUpdatedOrder}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditOrderPopup;