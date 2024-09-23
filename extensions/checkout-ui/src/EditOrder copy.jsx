import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client'; 
import { GET_ORDER } from './queries/getOrder.graphql';

const EditOrder = () => {
  const [showEditOrderPopup, setShowEditOrderPopup] = useState(false);
  const [order, setOrder] = useState(null);

  const { loading, error, data } = useQuery(GET_ORDER);

  useEffect(() => {
    if (data) {
      setOrder(data.node.order);
    }
  }, [data]);

  const handleEditOrderClick = () => {
    setShowEditOrderPopup(true);
  };

  return (
    <div className="edit-order">
      <h3>Edit Order easily</h3>
      <strong>Take control of your Edit order with these actions</strong>
      <button onClick={handleEditOrderClick}>Edit Order</button>
      {showEditOrderPopup && <EditOrderPopup order={order} onClose={() => setShowEditOrderPopup(false)} />}
      {loading && <p>Loading order...</p>}
      {error && <p>Error fetching order: {error.message}</p>}
    </div>
  );
};

export default EditOrder;