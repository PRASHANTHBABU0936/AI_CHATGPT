# Frontend Setup Instructions

## Installation

1. Navigate to the FRONTEND directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

### Authentication
- Modern login/register forms with ChatGPT/DeepSeek inspired design
- JWT token management
- Protected routes
- User profile management
- Automatic token refresh
- Logout functionality

### UI Components
- `AuthForm` - Main authentication form
- `Login` - Login component
- `Register` - Registration component
- `UserProfile` - User profile dropdown in sidebar
- `ProtectedRoute` - Route protection wrapper

### Styling
- Responsive design
- Dark mode support
- Modern gradient backgrounds
- Smooth animations
- Accessibility features

## Authentication Flow

1. User visits the app
2. If not authenticated, shows login/register form
3. After successful login/register, user is redirected to chat interface
4. JWT token is stored in localStorage
5. All API requests include the token automatically
6. Token is verified on each request
7. If token expires, user is redirected to login

## Context Usage

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Use authentication state and methods
}
```

