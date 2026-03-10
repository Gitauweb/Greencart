# Greencart Backend

MERN Stack Backend API for Greencart e-commerce application

## Features

- User Authentication (Login & Register)
- JWT Token-based Authentication
- Password Hashing with bcrypt
- MongoDB Integration
- CORS Enabled for Frontend

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **URL:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "isSeller": false
    },
    "token": "jwt_token"
  }
  ```

#### Login User
- **URL:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** Same as register response

#### Get Current User
- **URL:** `GET /api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer {token}
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "isSeller": false
    }
  }
  ```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  isSeller: Boolean (default: false),
  createdAt: Date (default: now)
}
```

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   └── authController.js    # Auth logic
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   └── User.js              # User schema
├── routes/
│   └── authRoutes.js        # Auth routes
├── server.js                 # Main server file
├── .env                      # Environment variables
├── .gitignore                # Git ignore
└── package.json              # Dependencies
```

## MongoDB Connection

### Local MongoDB
Make sure MongoDB is running locally on default port 27017

### MongoDB Atlas (Cloud)
Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart
```

## Testing the API

You can test the API using Postman or any REST client:

1. **Register a user:**
   - POST: http://localhost:5000/api/auth/register
   - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "pass123" }`

2. **Login:**
   - POST: http://localhost:5000/api/auth/login
   - Body: `{ "email": "john@example.com", "password": "pass123" }`

3. **Get current user:**
   - GET: http://localhost:5000/api/auth/me
   - Headers: `Authorization: Bearer {token_from_login}`

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (Vite default dev server).

To change this, update the CORS origin in `server.js`:
```javascript
origin: 'your-frontend-url'
```

## Error Handling

All API errors return in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Notes

- Always change `JWT_SECRET` in production
- Use environment variables for sensitive data
- Implement rate limiting in production
- Use HTTPS in production
- Add input validation on all endpoints
- Consider adding email verification for registration

## Future Enhancements

- Email verification on registration
- Password reset functionality
- Refresh token implementation
- Role-based access control (Admin, Seller, Customer)
- Product management endpoints
- Order management endpoints
- Payment integration
