# SkillNexus

A production-grade MERN stack application for AI-powered skill evaluation with clean architecture, modern best practices, and **real-time WebSocket features**.

## 🚀 New: Real-Time Features

- ✅ **Live Test Progress Tracking** - Monitor students in real-time
- ✅ **Real-Time Leaderboard** - Auto-updating rankings
- ✅ **Instant Notifications** - Bell icon with live updates
- ✅ **Recruiter Dashboard Live Updates** - Real-time statistics and monitoring
- ✅ **AI Assistant Chatbot** - Context-aware floating chatbot with streaming responses

👉 **[WebSocket Quick Start Guide](WEBSOCKET_QUICKSTART.md)**
👉 **[Complete WebSocket Documentation](WEBSOCKET_DOCUMENTATION.md)**
👉 **[AI Chatbot Documentation](AI_CHATBOT_DOCUMENTATION.md)**

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Clean Layered Architecture**: Routes → Controllers → Services → Agents → Models
- **JWT Authentication**: Access tokens (15m) + Refresh tokens (7d)
- **Role-Based Access Control**: Admin, Recruiter, Student roles
- **Global Error Handling**: Centralized error middleware
- **Standardized API Responses**: Consistent response format

### Frontend (React + Vite + TypeScript)
- **Modern Stack**: React 18, Vite, TypeScript, Tailwind CSS
- **State Management**: Zustand for auth state
- **Theme Support**: Dark/Light mode toggle with persistence
- **Clean SaaS Structure**: Components, Pages, Hooks, Services, Utils, Context
- **Protected Routes**: Route guards with authentication

## 📁 Project Structure

```
skillEevaluationplatform/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, JWT configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── agents/         # AI evaluation logic
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/     # Reusable UI components
    │   │   ├── layout/     # Layout components
    │   │   ├── auth/       # Auth-related components
    │   │   └── dashboard/  # Dashboard components
    │   ├── pages/          # Page components
    │   ├── hooks/          # Custom React hooks
    │   ├── services/       # API services
    │   ├── context/        # Context providers & stores
    │   ├── utils/          # Helper functions
    │   ├── types/          # TypeScript types
    │   ├── styles/         # Global styles
    │   ├── App.tsx         # Main app component
    │   └── main.tsx        # Entry point
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-skill-evaluation
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 Features

### Backend
✅ JWT authentication with refresh tokens
✅ Role-based access control (Admin, Recruiter, Student)
✅ Global error handling middleware
✅ Request validation with express-validator
✅ Security headers with Helmet
✅ Rate limiting
✅ CORS configuration
✅ MongoDB with Mongoose
✅ Password hashing with bcrypt
✅ Standardized API responses
✅ **WebSocket support with Socket.io**
✅ **Real-time notifications**
✅ **Live event broadcasting**

### Frontend
✅ React 18 with TypeScript
✅ Vite for fast development
✅ Tailwind CSS for styling
✅ Dark/Light theme toggle
✅ Zustand for state management
✅ Protected routes
✅ Axios interceptors for token refresh
✅ Responsive design
✅ Form validation
✅ Error handling
✅ **Socket.io client integration**
✅ **Real-time UI components**
✅ **Custom WebSocket hooks**

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- HTTP security headers (Helmet)
- Rate limiting
- CORS protection
- Input validation
- XSS protection
- Token refresh mechanism

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io (WebSocket)
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- Helmet
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Zustand
- Axios
- Socket.io Client
- Framer Motion

## 📝 Development Guidelines

### Backend
- Follow clean architecture principles
- Keep controllers thin, services fat
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs
- Use meaningful variable names

### Frontend
- Use TypeScript for type safety
- Follow React best practices
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Follow Tailwind CSS conventions

## 🚢 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure MongoDB Atlas
4. Set up proper logging
5. Enable HTTPS
6. Configure environment variables

### Frontend
1. Build for production: `npm run build`
2. Serve static files
3. Configure API base URL
4. Enable HTTPS
5. Set up CDN (optional)

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please follow the existing code style and architecture patterns.
