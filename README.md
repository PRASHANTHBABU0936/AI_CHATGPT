# AI Chat Application with JWT Authentication

A modern, full-stack AI chat application with comprehensive JWT authentication, inspired by ChatGPT and DeepSeek interfaces.

## 🚀 Features

### Authentication System
- **JWT-based authentication** with secure token management
- **User registration and login** with form validation
- **Password hashing** using bcrypt with salt rounds
- **Rate limiting** on authentication endpoints
- **Protected routes** with automatic token verification
- **User profile management** with avatar support
- **Secure logout** with token invalidation

### Frontend Features
- **Modern UI/UX** inspired by ChatGPT and DeepSeek
- **Responsive design** that works on all devices
- **Dark mode support** with smooth transitions
- **Real-time chat** with AI responses
- **Thread management** with persistent chat history
- **User profile dropdown** in sidebar
- **Loading states** and error handling

### Backend Features
- **RESTful API** with comprehensive error handling
- **MongoDB integration** with Mongoose ODM
- **OpenAI API integration** for AI responses
- **CORS configuration** for cross-origin requests
- **Input validation** and sanitization
- **Database indexing** for optimal performance

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **OpenAI API** for AI responses

### Frontend
- **React 19** with modern hooks
- **Vite** for fast development
- **Axios** for API requests
- **React Markdown** for message rendering
- **CSS3** with modern features
- **Context API** for state management

## 📁 Project Structure

```
├── BACKEND/
│   ├── models/
│   │   ├── User.js          # User model with validation
│   │   └── Thread.js        # Chat thread model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── chat.js          # Chat routes (protected)
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── utils/
│   │   └── openai.js        # OpenAI API integration
│   ├── server.js            # Main server file
│   └── package.json
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── UserProfile.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── Chat.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── Sidebar.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd BACKEND
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/your-database-name
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   PORT=8080
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd FRONTEND
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔐 Authentication Flow

1. **User Registration/Login:**
   - User fills out the authentication form
   - Backend validates credentials and creates/verifies user
   - JWT token is generated and returned
   - Token is stored in localStorage

2. **Protected Routes:**
   - All chat functionality requires authentication
   - Token is automatically included in API requests
   - Backend verifies token on each request
   - Invalid/expired tokens redirect to login

3. **User Management:**
   - User profile displayed in sidebar
   - Logout functionality clears tokens
   - Profile updates are persisted

## 🎨 UI/UX Features

### Design Philosophy
- **Clean and minimal** interface inspired by ChatGPT
- **Professional color scheme** with gradients
- **Smooth animations** and transitions
- **Responsive design** for all screen sizes
- **Accessibility features** for better usability

### Components
- **Authentication forms** with real-time validation
- **Chat interface** with message history
- **Sidebar navigation** with thread management
- **User profile dropdown** with logout option
- **Loading states** and error handling

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Chat (Protected)
- `GET /api/thread` - Get all user threads
- `GET /api/thread/:threadId` - Get specific thread
- `DELETE /api/thread/:threadId` - Delete thread
- `POST /api/chat` - Send message to AI

## 🛡️ Security Features

- **JWT token authentication** with expiration
- **Password hashing** with bcrypt and salt rounds
- **Rate limiting** on authentication endpoints
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Protected routes** with middleware
- **Error handling** without information leakage

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for the GPT API
- React team for the amazing framework
- MongoDB for the database solution
- All open-source contributors

---

**Happy coding! 🚀**

