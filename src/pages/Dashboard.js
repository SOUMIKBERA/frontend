import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deliveryAPI } from '../utils/api';
import { FaBox, FaClock, FaTruck, FaCheckCircle, FaPlus } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, deliveriesRes] = await Promise.all([
        deliveryAPI.getStats(),
        deliveryAPI.getAll({ page: 1, limit: 5 })
      ]);

      setStats(statsRes.data.data);
      setRecentDeliveries(deliveriesRes.data.data.deliveries);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      created: 'bg-blue-100 text-blue-800',
      accepted: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-purple-100 text-purple-800',
      on_the_way: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="card hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalDeliveries = stats?.totalDeliveries || 0;
  const statusBreakdown = stats?.statusBreakdown || [];
  
  const createdCount = statusBreakdown.find(s => s._id === 'created')?.count || 0;
  const inProgressCount = statusBreakdown.filter(s => 
    ['accepted', 'picked_up', 'on_the_way'].includes(s._id)
  ).reduce((sum, s) => sum + s.count, 0);
  const deliveredCount = statusBreakdown.find(s => s._id === 'delivered')?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your deliveries today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaBox}
            title="Total Deliveries"
            value={totalDeliveries}
            color="bg-primary-600"
          />
          <StatCard
            icon={FaClock}
            title="Pending"
            value={createdCount}
            color="bg-yellow-500"
          />
          <StatCard
            icon={FaTruck}
            title="In Progress"
            value={inProgressCount}
            color="bg-indigo-500"
          />
          <StatCard
            icon={FaCheckCircle}
            title="Delivered"
            value={deliveredCount}
            color="bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Deliveries</h2>
                <button
                  onClick={() => navigate('/deliveries')}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {recentDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
                  <p className="text-gray-600 mb-4">No deliveries yet</p>
                  {(user.role === 'admin' || user.role === 'business') && (
                    <button
                      onClick={() => navigate('/deliveries/create')}
                      className="btn-primary"
                    >
                      Create First Delivery
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentDeliveries.map((delivery) => (
                    <div
                      key={delivery._id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition cursor-pointer"
                      onClick={() => navigate(`/deliveries/${delivery._id}`)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {delivery.trackingId}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {delivery.customerInfo.name}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {delivery.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>{delivery.pickupAddress.city} → {delivery.dropAddress.city}</span>
                        <span className="font-semibold text-primary-600">₹{delivery.pricing.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {(user.role === 'admin' || user.role === 'business') && (
              <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                <h3 className="text-lg font-semibold mb-2">Create New Delivery</h3>
                <p className="text-sm text-primary-100 mb-4">
                  Start a new delivery request in seconds
                </p>
                <button
                  onClick={() => navigate('/deliveries/create')}
                  className="w-full bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50 transition font-medium flex items-center justify-center space-x-2"
                >
                  <FaPlus />
                  <span>New Delivery</span>
                </button>
              </div>
            )}

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {statusBreakdown.map((stat) => (
                  <div key={stat._id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {stat._id.replace('_', ' ')}
                    </span>
                    <span className="font-semibold text-gray-900">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;