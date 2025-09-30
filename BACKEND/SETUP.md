# Backend Setup Instructions

## Environment Variables

Create a `.env` file in the BACKEND directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Secret (generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# Server Configuration
PORT=8080
FRONTEND_URL=http://localhost:5173
```

## Installation

1. Navigate to the BACKEND directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Chat (Protected)
- `GET /api/thread` - Get all user threads
- `GET /api/thread/:threadId` - Get specific thread
- `DELETE /api/thread/:threadId` - Delete thread
- `POST /api/chat` - Send message to AI

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting on auth routes
- Input validation
- CORS configuration
- Protected routes middleware

