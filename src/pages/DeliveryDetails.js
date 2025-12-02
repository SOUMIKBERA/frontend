import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deliveryAPI } from '../utils/api';
import { FaArrowLeft, FaMapMarkerAlt, FaBox, FaUser, FaTruck, FaCheckCircle } from 'react-icons/fa';

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusNotes, setStatusNotes] = useState('');

  useEffect(() => {
    fetchDelivery();
  }, [id]);

  const fetchDelivery = async () => {
    try {
      const response = await deliveryAPI.getById(id);
      setDelivery(response.data.data.delivery);
    } catch (error) {
      console.error('Error fetching delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async () => {
    try {
      setUpdating(true);
      await deliveryAPI.acceptDelivery(id);
      await fetchDelivery();
      alert('Delivery accepted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept delivery');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      await deliveryAPI.updateStatus(id, newStatus, statusNotes);
      await fetchDelivery();
      setStatusNotes('');
      alert('Status updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = () => {
    const statusFlow = {
      created: null,
      accepted: 'picked_up',
      picked_up: 'on_the_way',
      on_the_way: 'delivered'
    };
    return statusFlow[delivery?.status];
  };

  const getNextStatusText = () => {
    const statusText = {
      picked_up: 'Mark as Picked Up',
      on_the_way: 'Mark On the Way',
      delivered: 'Mark as Delivered'
    };
    return statusText[getNextStatus()];
  };

  const getStatusColor = (status) => {
    const colors = {
      created: 'bg-blue-500',
      accepted: 'bg-yellow-500',
      picked_up: 'bg-purple-500',
      on_the_way: 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="card text-center">
            <p className="text-gray-600">Delivery not found</p>
            <button onClick={() => navigate('/deliveries')} className="btn-primary mt-4">
              Back to Deliveries
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/deliveries')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Deliveries
        </button>

        <div className="card mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{delivery.trackingId}</h1>
              <p className="text-gray-600 mt-1">
                Created on {new Date(delivery.createdAt).toLocaleString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(delivery.status)}`}>
              {delivery.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-green-500" />
                  <h3 className="font-semibold text-gray-900">Pickup Address</h3>
                </div>
                <p className="text-gray-700">{delivery.pickupAddress.street}</p>
                <p className="text-gray-600">
                  {delivery.pickupAddress.city}, {delivery.pickupAddress.state} {delivery.pickupAddress.zipCode}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <h3 className="font-semibold text-gray-900">Drop Address</h3>
                </div>
                <p className="text-gray-700">{delivery.dropAddress.street}</p>
                <p className="text-gray-600">
                  {delivery.dropAddress.city}, {delivery.dropAddress.state} {delivery.dropAddress.zipCode}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-primary-500" />
                  <h3 className="font-semibold text-gray-900">Customer Information</h3>
                </div>
                <p className="text-gray-700 font-medium">{delivery.customerInfo.name}</p>
                <p className="text-gray-600">{delivery.customerInfo.phone}</p>
                {delivery.customerInfo.email && (
                  <p className="text-gray-600">{delivery.customerInfo.email}</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FaBox className="text-purple-500" />
                  <h3 className="font-semibold text-gray-900">Package Details</h3>
                </div>
                <p className="text-gray-700">Weight: <span className="font-medium">{delivery.packageDetails.weight} kg</span></p>
                <p className="text-gray-700">Priority: <span className="font-medium capitalize">{delivery.priority}</span></p>
                {delivery.packageDetails.description && (
                  <p className="text-gray-600 mt-2">{delivery.packageDetails.description}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Distance: <span className="font-medium">{delivery.estimatedDistance} km</span></p>
                {delivery.driver && (
                  <p className="text-gray-600 mt-1">
                    Driver: <span className="font-medium">{delivery.driver.name}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">₹{delivery.pricing.totalPrice}</p>
                <p className="text-sm text-gray-500">Total Price</p>
                {delivery.estimatedDeliveryTime && (
                   <p className="text-xs text-gray-500 mt-1">
                       Est. delivery: {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}
                   </p>
                 )}
              </div>
            </div>
          </div>
        </div>

        {user.role === 'driver' && (
          <div className="card mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Driver Actions</h3>
            
            {delivery.status === 'created' && !delivery.driver && (
              <button
                onClick={handleAcceptDelivery}
                disabled={updating}
                className="btn-primary w-full disabled:opacity-50"
              >
                {updating ? 'Accepting...' : 'Accept Delivery'}
              </button>
            )}

            {delivery.driver?._id === user.id && getNextStatus() && (
              <div className="space-y-4">
                <textarea
                  className="input-field"
                  rows="3"
                  placeholder="Add notes (optional)..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                />
                <button
                  onClick={() => handleUpdateStatus(getNextStatus())}
                  disabled={updating}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {updating ? 'Updating...' : getNextStatusText()}
                </button>
              </div>
            )}

            {delivery.status === 'delivered' && (
              <div className="flex items-center justify-center gap-2 text-green-600 py-4">
                <FaCheckCircle className="text-2xl" />
                <span className="font-semibold">Delivery Completed</span>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Status History</h3>
          <div className="space-y-4">
            {delivery.statusHistory.map((history, index) => (
              <div key={index} className="flex gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(history.status)}`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 capitalize">
                    {history.status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(history.timestamp).toLocaleString()}
                  </p>
                  {history.notes && (
                    <p className="text-sm text-gray-500 mt-1">{history.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;