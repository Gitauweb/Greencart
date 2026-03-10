# Greencart - MERN Stack E-commerce Application

A full-stack e-commerce application for grocery delivery built with React, Node.js, Express, and MongoDB.

## Project Structure

```
Greencart/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # App context & state management
│   │   ├── pages/         # Page components
│   │   └── assets/        # Images and static assets
│   ├── package.json
│   └── .env              # Frontend environment variables
│
├── server/                # Node.js Backend (Express)
│   ├── config/           # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env              # Backend environment variables
│
└── README.md
```

## Tech Stack

### Frontend
- React 19
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router (Routing)
- Axios (HTTP client)
- React Hot Toast (Notifications)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose (ODM)
- JWT (Authentication)
- bcrypt (Password hashing)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Greencart
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create `.env` file in the server directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

In a new terminal, navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create `.env` file in the client directory:
```
VITE_API_URL=http://localhost:5000/api
VITE_CURRENCY=$
```

Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features Implemented

### Authentication
- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Authentication
- ✅ Password Hashing with bcrypt
- ✅ Persistent Login (localStorage)
- ✅ Protected Routes

### User Management
- ✅ User authentication context
- ✅ User state management
- ✅ Logout functionality

### Frontend Components
- ✅ Login/Register Modal
- ✅ Navigation Bar
- ✅ Product Categories
- ✅ Product Cards
- ✅ Shopping Cart

### Backend API
- ✅ User Registration endpoint
- ✅ User Login endpoint
- ✅ Get Current User endpoint
- ✅ JWT authentication middleware
- ✅ Input validation
- ✅ Error handling

## API Documentation

For detailed API documentation, see [Backend README](./server/README.md)

### Quick API Reference

**Register User**
```
POST /api/auth/register
Body: { name, email, password }
```

**Login User**
```
POST /api/auth/login
Body: { email, password }
```

**Get Current User**
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

## Database Setup

### MongoDB Local Setup
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. MongoDB will be available at `mongodb://localhost:27017`

### MongoDB Atlas (Cloud)
1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify MongoDB is running
- Check .env file is correctly configured

### Frontend can't connect to backend
- Ensure backend is running on http://localhost:5000
- Check VITE_API_URL in client/.env
- Check browser console for CORS errors

### Login not working
- Verify MongoDB is running
- Check backend server logs
- Ensure credentials are correct

## Development Workflow

### Running Both Frontend and Backend
1. Open two terminals
2. Terminal 1: `cd server && npm run dev`
3. Terminal 2: `cd client && npm run dev`
4. Open http://localhost:5173 in browser

### Making Changes
- Backend changes will auto-reload with nodemon
- Frontend changes will hot-reload with Vite

## Git Workflow

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Your message"

# Push to repository
git push origin main
```

## Security Notes

⚠️ **Important for Production:**
- Change JWT_SECRET to a strong password
- Use HTTPS instead of HTTP
- Implement rate limiting
- Add email verification
- Use environment variables properly
- Add CSRF protection
- Implement proper error handling without exposing database details

## Future Enhancements

- [ ] Email verification on registration
- [ ] Password reset functionality
- [ ] Seller dashboard
- [ ] Product management
- [ ] Order tracking
- [ ] Payment gateway integration
- [ ] Admin panel
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Advanced search and filters
- [ ] User profile management
- [ ] Notification system

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[Add your license here]

## Support

For questions or issues, please create an issue in the repository.

## Contact

[Add your contact information here]


