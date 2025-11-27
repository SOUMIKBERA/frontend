import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deliveryAPI } from '../utils/api';
import { FaBox, FaSearch, FaFilter } from 'react-icons/fa';

const DeliveryList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDeliveries();
  }, [statusFilter]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      
      const response = await deliveryAPI.getAll(params);
      setDeliveries(response.data.data.deliveries);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      created: 'bg-blue-100 text-blue-800 border-blue-200',
      accepted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      picked_up: 'bg-purple-100 text-purple-800 border-purple-200',
      on_the_way: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    delivery.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'driver' ? 'Available Deliveries' : 'All Deliveries'}
          </h1>
          <p className="mt-2 text-gray-600">
            {user.role === 'driver' 
              ? 'View and accept delivery requests' 
              : 'Manage your delivery orders'}
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tracking ID or customer name..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="created">Created</option>
                <option value="accepted">Accepted</option>
                <option value="picked_up">Picked Up</option>
                <option value="on_the_way">On the Way</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="card text-center py-12">
            <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-600 text-lg mb-2">No deliveries found</p>
            <p className="text-gray-500 text-sm">
              {user.role === 'driver' 
                ? 'Check back later for new delivery requests' 
                : 'Create your first delivery to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery._id}
                className="card hover:shadow-lg transition cursor-pointer border border-gray-200"
                onClick={() => navigate(`/deliveries/${delivery._id}`)}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-bold text-lg text-gray-900">
                        {delivery.trackingId}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        delivery.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                        delivery.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        delivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {delivery.priority.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Customer</p>
                        <p className="font-medium text-gray-900">{delivery.customerInfo.name}</p>
                        <p className="text-gray-600">{delivery.customerInfo.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Route</p>
                        <p className="text-gray-900">
                          <span className="font-medium">{delivery.pickupAddress.city}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{delivery.dropAddress.city}</span>
                        </p>
                        <p className="text-gray-600">{delivery.estimatedDistance} km</p>
                      </div>
                    </div>

                    {delivery.packageDetails?.description && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">{delivery.packageDetails.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right mb-2">
                      <p className="text-2xl font-bold text-primary-600">
                        ₹{delivery.pricing.totalPrice}
                      </p>
                      <p className="text-xs text-gray-500">{delivery.packageDetails.weight} kg</p>
                    </div>
                    
                    {user.role === 'driver' && delivery.status === 'created' && !delivery.driver && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/deliveries/${delivery._id}`);
                        }}
                        className="btn-primary text-sm"
                      >
                        Accept Delivery
                      </button>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(delivery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryList;