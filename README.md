# QuickShip -  Logistics & Delivery Management Platform

A full-stack logistics management system built with microservices architecture, featuring role-based authentication, real-time delivery tracking, and a modern responsive UI.

## 🚀 Tech Stack

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Microservices (Auth Service, Delivery Service)
- **Validation**: Express-Validator

### Frontend
- **Framework**: React.js 18
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Icons**: React Icons

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## 🛠️ Complete Installation Guide

### Step 1: Install MongoDB

**For Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Service (check the box)
5. After installation, MongoDB will start automatically

**Verify MongoDB Installation:**
```bash
# Open Command Prompt and type:
mongo --version
```

### Step 2: Clone/Create Project Structure

```bash
# Create project directory
mkdir logistics-platform
cd logistics-platform

# Create backend and frontend folders
mkdir backend frontend
```

### Step 3: Setup Backend

```bash
# Navigate to backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken cors dotenv express-validator socket.io

# Install dev dependencies
npm install --save-dev nodemon
```

**Create Backend Structure:**
```bash
# Create all required folders
mkdir auth-service delivery-service shared
cd auth-service
mkdir controllers models routes middleware
cd ../delivery-service
mkdir controllers models routes middleware
cd ../shared
mkdir config utils
cd ../..
```

### Step 4: Create Backend Files

Copy all the backend files I provided earlier into their respective locations:

**Key Files to Create:**
1. `backend/package.json` - Already created with npm init
2. `backend/.env` - Environment variables
3. `backend/server.js` - Main server file
4. `backend/shared/config/database.js` - Database configuration
5. `backend/shared/utils/jwtHelper.js` - JWT utilities
6. `backend/auth-service/models/User.js` - User model
7. `backend/auth-service/controllers/authController.js` - Auth logic
8. `backend/auth-service/routes/authRoutes.js` - Auth routes
9. `backend/auth-service/middleware/auth.js` - Auth middleware
10. `backend/delivery-service/models/Delivery.js` - Delivery model
11. `backend/delivery-service/controllers/deliveryController.js` - Delivery logic
12. `backend/delivery-service/routes/deliveryRoutes.js` - Delivery routes

### Step 5: Setup Frontend

```bash
# From logistics-platform directory
npx create-react-app frontend

# Navigate to frontend
cd frontend

# Install dependencies
npm install axios react-router-dom tailwindcss postcss autoprefixer react-icons

# Initialize Tailwind
npx tailwindcss init -p
```

### Step 6: Create Frontend Files

**Configure Tailwind:**
Update `frontend/tailwind.config.js` with the provided configuration.

**Create Frontend Structure:**
```bash
cd src
mkdir components pages context utils
```

**Create these files:**
1. `frontend/src/index.css` - Global styles with Tailwind
2. `frontend/src/App.js` - Main app component
3. `frontend/src/utils/api.js` - API utilities
4. `frontend/src/context/AuthContext.js` - Authentication context
5. `frontend/src/components/Navbar.js` - Navigation component
6. `frontend/src/pages/Login.js` - Login page
7. `frontend/src/pages/Register.js` - Registration page
8. `frontend/src/pages/Dashboard.js` - Dashboard
9. `frontend/src/pages/CreateDelivery.js` - Create delivery form

### Step 7: Start MongoDB

```bash
# Windows - MongoDB should start automatically as a service
# If not, open Command Prompt as Administrator:
net start MongoDB

# Verify MongoDB is running:
mongo
# You should see MongoDB shell prompt
# Type 'exit' to quit
```

### Step 8: Start Backend Server

```bash
# From backend directory
cd backend
npm run dev

# You should see:
# Server running in development mode on port 5000
# MongoDB Connected: localhost
```

### Step 9: Start Frontend Development Server

```bash
# Open new terminal
# From logistics-platform directory
cd frontend
npm start

# Browser should automatically open http://localhost:3000
```

## 🎯 Usage Guide

### 1. Register Users

**Create Admin User (use MongoDB Compass or Mongo Shell):**
```javascript
// Connect to MongoDB and run:
use logistics_platform
db.users.updateOne(
  { email: "admin@quickship.com" },
  { $set: { role: "admin" } }
)
```

**Or Register via UI:**
1. Go to http://localhost:3000/register
2. Fill in details:
   - Name: Admin User
   - Email: admin@quickship.com
   - Password: admin123
   - Phone: 9876543210
   - Role: Business User (change to admin later in DB)
3. Click "Create Account"

**Register Business User:**
- Role: Business User

**Register Driver:**
- Role: Driver

### 2. Create Delivery (Business/Admin)

1. Login as Business or Admin user
2. Click "Create Delivery"
3. Fill in:
   - Pickup Address: Full address with city, state, ZIP
   - Drop Address: Delivery destination
   - Customer Info: Recipient details
   - Package Details: Weight (e.g., 5.0 kg)
   - Priority: Low/Medium/High/Urgent
4. Click "Create Delivery"

### 3. Manage Deliveries

**As Driver:**
- View available deliveries
- Accept deliveries
- Update status: Picked Up → On the Way → Delivered

**As Admin:**
- View all deliveries
- Assign drivers manually
- Monitor all operations

## 🔐 Default Test Credentials

After registration, you can create test accounts:

**Admin:**
- Email: admin@quickship.com
- Password: admin123

**Business User:**
- Email: business@quickship.com
- Password: business123

**Driver:**
- Email: driver@quickship.com
- Password: driver123

## 📁 Project Structure

```
logistics-platform/
├── backend/
│   ├── auth-service/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   └── middleware/
│   │       └── auth.js
│   ├── delivery-service/
│   │   ├── controllers/
│   │   │   └── deliveryController.js
│   │   ├── models/
│   │   │   └── Delivery.js
│   │   └── routes/
│   │       └── deliveryRoutes.js
│   ├── shared/
│   │   ├── config/
│   │   │   └── database.js
│   │   └── utils/
│   │       └── jwtHelper.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   └── CreateDelivery.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🎨 Features Implemented

### Core Features ✅
- ✅ User Authentication (JWT)
- ✅ Role-based Access Control (Admin, Business, Driver)
- ✅ Delivery Management (CRUD)
- ✅ Status Workflow (Created → Accepted → Picked Up → On the Way → Delivered)
- ✅ Driver Assignment
- ✅ Responsive UI
- ✅ Dashboard with Statistics
- ✅ Real-time Price Calculation

### Bonus Features ✅
- ✅ Dynamic pricing based on distance & weight
- ✅ Priority-based pricing
- ✅ Status history tracking
- ✅ Delivery statistics
- ✅ Professional UI/UX

## 🏗️ Architecture & Design Decisions

### Why Microservices?
1. **Scalability**: Auth and Delivery services can scale independently
2. **Maintainability**: Clear separation of concerns
3. **Team Collaboration**: Different teams can work on different services
4. **Fault Isolation**: Issues in one service don't affect others

### Why MongoDB?
1. **Flexibility**: Schema-less design for rapid development
2. **Scalability**: Horizontal scaling with sharding
3. **Performance**: Fast read/write operations
4. **Document Model**: Perfect for hierarchical data (addresses, status history)

### Security Measures
- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- Role-based authorization middleware
- Input validation with express-validator
- Protected routes on frontend

## 📈 Scaling to 100K Users

### Database Optimization
1. **Indexing**: Added indexes on frequently queried fields (email, role, status, tracking ID)
2. **Sharding**: Implement MongoDB sharding by user region
3. **Read Replicas**: Add read replicas for query distribution
4. **Caching**: Implement Redis for session management and frequently accessed data

### Backend Optimization
1. **Load Balancing**: Deploy multiple instances behind Nginx/AWS ALB
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **API Gateway**: Add Kong or AWS API Gateway
4. **Message Queue**: Use RabbitMQ/Kafka for async operations
5. **Monitoring**: Implement Prometheus + Grafana

### Frontend Optimization
1. **CDN**: Serve static assets via CDN (CloudFlare/AWS CloudFront)
2. **Code Splitting**: Implement React lazy loading
3. **Service Worker**: Add PWA capabilities
4. **Image Optimization**: Use WebP format and lazy loading

### Infrastructure
- **Containerization**: Docker + Kubernetes for orchestration
- **Auto-scaling**: Configure horizontal pod autoscaling
- **Database**: MongoDB Atlas with automatic scaling
- **Monitoring**: New Relic/Datadog for application monitoring

## 🚀 Future Enhancements (2 More Weeks)

1. **Real-time Features**
   - WebSocket integration for live tracking
   - Push notifications for status updates
   - Live driver location on map

2. **Advanced Features**
   - Multi-stop deliveries
   - Route optimization algorithm
   - Driver ratings & reviews
   - Automated driver matching based on location
   - Invoice generation
   - Email/SMS notifications

3. **Analytics Dashboard**
   - Revenue analytics
   - Delivery performance metrics
   - Driver performance tracking
   - Heat maps for popular routes

4. **Mobile App**
   - React Native mobile app for drivers
   - Barcode/QR scanning for packages
   - Offline mode support

5. **Payment Integration**
   - Stripe/Razorpay integration
   - Wallet system
   - Multiple payment methods

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Access protected route without token (should redirect)
- [ ] Logout

**Delivery Management:**
- [ ] Create delivery as business user
- [ ] View all deliveries
- [ ] Assign driver as admin
- [ ] Accept delivery as driver
- [ ] Update delivery status
- [ ] View delivery details

**Role-based Access:**
- [ ] Business user cannot accept deliveries
- [ ] Driver cannot create deliveries
- [ ] Only admin can assign drivers

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Ensure MongoDB is running:
net start MongoDB

# Check connection string in .env:
MONGODB_URI=mongodb://localhost:27017/logistics_platform
```

### Port Already in Use
```bash
# Backend (Port 5000):
# Kill process on Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (Port 3000):
# Kill process or use different port:
set PORT=3001 && npm start
```

### CORS Errors
- Ensure backend has CORS enabled (already configured)
- Check API_URL in frontend matches backend URL

### JWT Errors
- Verify JWT_SECRET in .env
- Check token expiry time
- Clear localStorage and login again

## 📞 Support

For issues or questions:
1. Check this README thoroughly
2. Review code comments
3. Check console for errors
4. Verify all dependencies are installed

## 📄 License

This project is created for educational purposes.

---

**Built with  using Node.js, React.js, and MongoDB**