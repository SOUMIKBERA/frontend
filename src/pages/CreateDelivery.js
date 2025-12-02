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
      coordinates: { lat: null, lng: null }
    },
    dropAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: null, lng: null }
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

  // Major Indian cities coordinates
  const cityCoordinates = {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kolkata': { lat: 22.5726, lng: 88.3639 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Surat': { lat: 21.1702, lng: 72.8311 },
    'Lucknow': { lat: 26.8467, lng: 80.9462 },
    'Kanpur': { lat: 26.4499, lng: 80.3319 },
    'Nagpur': { lat: 21.1458, lng: 79.0882 },
    'Indore': { lat: 22.7196, lng: 75.8577 },
    'Thane': { lat: 19.2183, lng: 72.9781 },
    'Bhopal': { lat: 23.2599, lng: 77.4126 },
    'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'Patna': { lat: 25.5941, lng: 85.1376 },
    'Vadodara': { lat: 22.3072, lng: 73.1812 },
    'Ghaziabad': { lat: 28.6692, lng: 77.4538 },
    'Ludhiana': { lat: 30.9010, lng: 75.8573 },
    'Agra': { lat: 27.1767, lng: 78.0081 },
    'Nashik': { lat: 19.9975, lng: 73.7898 },
    'Faridabad': { lat: 28.4089, lng: 77.3178 },
    'Meerut': { lat: 28.9845, lng: 77.7064 },
    'Rajkot': { lat: 22.3039, lng: 70.8022 },
    'Varanasi': { lat: 25.3176, lng: 82.9739 },
    'Amritsar': { lat: 31.6340, lng: 74.8723 },
    'Ranchi': { lat: 23.3441, lng: 85.3096 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Gurgaon': { lat: 28.4595, lng: 77.0266 },
    'Noida': { lat: 28.5355, lng: 77.3910 },
    'Kochi': { lat: 9.9312, lng: 76.2673 },
    'Chandigarh': { lat: 30.7333, lng: 76.7794 },
    'Guwahati': { lat: 26.1445, lng: 91.7362 }
  };

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCitySelect = (section, city) => {
    const coords = cityCoordinates[city];
    if (coords) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          city: city,
          coordinates: coords
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate coordinates exist
    if (!formData.pickupAddress.coordinates.lat || !formData.pickupAddress.coordinates.lng) {
      setError('Please select a pickup city from the dropdown list');
      setLoading(false);
      return;
    }

    if (!formData.dropAddress.coordinates.lat || !formData.dropAddress.coordinates.lng) {
      setError('Please select a drop city from the dropdown list');
      setLoading(false);
      return;
    }

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">* (Select from list)</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.pickupAddress.city}
                    onChange={(e) => handleCitySelect('pickupAddress', e.target.value)}
                  >
                    <option value="">-- Select City --</option>
                    {Object.keys(cityCoordinates).sort().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <p className="text-xs text-green-600 mt-1">
                    {formData.pickupAddress.coordinates.lat && '✓ Coordinates set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.pickupAddress.state}
                    onChange={(e) => handleChange('pickupAddress', 'state', e.target.value)}
                    placeholder="State"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">* (Select from list)</span>
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.dropAddress.city}
                    onChange={(e) => handleCitySelect('dropAddress', e.target.value)}
                  >
                    <option value="">-- Select City --</option>
                    {Object.keys(cityCoordinates).sort().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <p className="text-xs text-green-600 mt-1">
                    {formData.dropAddress.coordinates.lat && '✓ Coordinates set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.dropAddress.state}
                    onChange={(e) => handleChange('dropAddress', 'state', e.target.value)}
                    placeholder="State"
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