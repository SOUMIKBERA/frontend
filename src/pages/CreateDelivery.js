import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deliveryAPI } from '../utils/api';
import { FaArrowLeft } from 'react-icons/fa';

const CreateDelivery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    dropAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 28.7041, lng: 77.1025 }
    },
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    },
    packageDetails: {
      weight: '',
      description: ''
    },
    priority: 'medium',
    notes: ''
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        packageDetails: {
          ...formData.packageDetails,
          weight: parseFloat(formData.packageDetails.weight)
        }
      };

      const response = await deliveryAPI.create(submitData);
      navigate(`/deliveries/${response.data.data.delivery._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Delivery</h1>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pickup Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.pickupAddress.street}
                    onChange={(e) => handleChange('pickupAddress', 'street', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.pickupAddress.city}
                    onChange={(e) => handleChange('pickupAddress', 'city', e.target.value)}
                    placeholder="New Delhi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.pickupAddress.state}
                    onChange={(e) => handleChange('pickupAddress', 'state', e.target.value)}
                    placeholder="Delhi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.pickupAddress.zipCode}
                    onChange={(e) => handleChange('pickupAddress', 'zipCode', e.target.value)}
                    placeholder="110001"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Drop Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.dropAddress.street}
                    onChange={(e) => handleChange('dropAddress', 'street', e.target.value)}
                    placeholder="456 Park Avenue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.dropAddress.city}
                    onChange={(e) => handleChange('dropAddress', 'city', e.target.value)}
                    placeholder="Gurgaon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.dropAddress.state}
                    onChange={(e) => handleChange('dropAddress', 'state', e.target.value)}
                    placeholder="Haryana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.dropAddress.zipCode}
                    onChange={(e) => handleChange('dropAddress', 'zipCode', e.target.value)}
                    placeholder="122001"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.customerInfo.name}
                    onChange={(e) => handleChange('customerInfo', 'name', e.target.value)}
                    placeholder="Customer Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="input-field"
                    value={formData.customerInfo.phone}
                    onChange={(e) => handleChange('customerInfo', 'phone', e.target.value)}
                    placeholder="9876543210"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.customerInfo.email}
                    onChange={(e) => handleChange('customerInfo', 'email', e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Package Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    className="input-field"
                    value={formData.packageDetails.weight}
                    onChange={(e) => handleChange('packageDetails', 'weight', e.target.value)}
                    placeholder="5.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    className="input-field"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    value={formData.packageDetails.description}
                    onChange={(e) => handleChange('packageDetails', 'description', e.target.value)}
                    placeholder="Package description"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                className="input-field"
                rows="3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Delivery'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;