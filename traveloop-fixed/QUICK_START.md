# Quick Start Guide

## ⚡ Get Up and Running in 5 Minutes

### 1. Clone and Navigate
```bash
cd c:\Users\HP\Downloads\traveloop
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection string
npm run dev
```

**Backend will run at:** `http://localhost:5000`

### 3. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

**Frontend will run at:** `http://localhost:3000`

---

## 🧪 Test the App

1. Go to `http://localhost:3000`
2. Create a new account
3. Create a trip
4. View your trips on the dashboard

---

## 📝 What's Already Built

### Backend ✅
- Express.js server with CORS
- MongoDB connection setup
- JWT authentication (login/signup)
- Trip CRUD operations
- 7 MongoDB models (User, Trip, Stop, Activity, City, Checklist, Note)
- Error handling middleware
- Protected routes with JWT

### Frontend ✅
- React 18 + Vite
- Login & Signup pages
- Dashboard with trip list
- Create trip form
- Trip detail view
- User profile page
- Responsive design
- Zustand state management
- Axios API integration

---

## 🚀 What Needs Implementation

### High Priority
1. **Stops CRUD** - Add/edit/delete trip stops
2. **Activities CRUD** - Add/edit/delete activities for stops
3. **Itinerary Builder UI** - Interactive drag-and-drop interface
4. **Budget Tracking** - Track and display expenses
5. **City Search** - Search and add cities to trips
6. **Checklist Management** - Packing checklist functionality

### Medium Priority
- Trip sharing and public URLs
- Trip copy functionality
- Notes/Journal feature
- Image uploads
- User profile editing

### Low Priority
- Admin dashboard
- Analytics
- Social features

---

## 📚 Documentation

- [Main README](./README.md) - Full project overview
- [API Documentation](./backend/API_DOCUMENTATION.md) - All endpoints explained

---

## 🔑 Key Files to Know

### Backend
- `backend/src/server.js` - Main server file
- `backend/src/models/` - Database schemas
- `backend/src/controllers/` - Request handlers
- `backend/src/routes/` - API routes

### Frontend
- `frontend/src/App.jsx` - Main app component
- `frontend/src/pages/` - Page components
- `frontend/src/stores/` - State management
- `frontend/src/components/` - Reusable components

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB is running: `mongod`
- Check port 5000 is free
- Check .env file is configured

**Frontend won't load?**
- Check backend is running (should see "Server running on port 5000")
- Check port 3000 is free
- Clear browser cache and reload

**API requests fail?**
- Check backend/package.json dependencies are installed
- Check JWT token is being sent with requests
- Check CORS_ORIGIN in .env matches frontend URL

---

## 💡 Next Step

Implement the Itinerary Builder to allow users to add multiple stops and activities to their trips!

