# Traveloop - Personalized Travel Planning Application

A full-stack travel planning application built with React, Node.js/Express, and MongoDB. Create, manage, and share multi-city travel itineraries with ease.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **State Management**: Zustand
- **Authentication**: JWT

## Project Structure

```
traveloop/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── stores/          # Zustand stores (state management)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Express API
    ├── src/
    │   ├── models/          # MongoDB schemas
    │   ├── routes/          # API routes
    │   ├── controllers/      # Request handlers
    │   ├── middleware/       # Custom middleware
    │   └── server.js        # Entry point
    ├── package.json
    └── .env.example
```

## Features Implemented

### Authentication
- ✅ User signup and login
- ✅ JWT-based authentication
- ✅ Password encryption

### Trip Management
- ✅ Create new trips
- ✅ View all user trips
- ✅ View trip details
- ✅ Delete trips
- ✅ Basic trip editing

### Database Models
- ✅ User model with authentication
- ✅ Trip model with stops and budget
- ✅ Stop model with activities and accommodation
- ✅ Activity model with categories
- ✅ City model with metadata
- ✅ Checklist model for packing
- ✅ Note model for trip notes

### Pages/Screens Scaffolded
1. ✅ Login/Signup Screen
2. ✅ Dashboard/Home Screen
3. ✅ Create Trip Screen
4. ✅ My Trips (Trip List) Screen
5. 🔄 Itinerary Builder Screen (skeleton)
6. ✅ Itinerary View Screen
7. 🔄 City Search (API ready, UI scaffold)
8. 🔄 Activity Search (API ready, UI scaffold)
9. 🔄 Trip Budget & Cost Breakdown (scaffold)
10. 🔄 Packing Checklist (model ready)
11. 🔄 Shared/Public Itinerary View (skeleton)
12. ✅ User Profile / Settings Screen
13. 🔄 Trip Notes / Journal (model ready)
14. ❌ Admin / Analytics Dashboard (optional)

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Update .env with your values**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/traveloop
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run backend**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:5000`

### Frontend Setup

1. **Open new terminal and navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Trips
- `POST /api/trips` - Create new trip (protected)
- `GET /api/trips` - Get all user trips (protected)
- `GET /api/trips/:id` - Get trip details (protected)
- `PUT /api/trips/:id` - Update trip (protected)
- `DELETE /api/trips/:id` - Delete trip (protected)
- `GET /api/trips/public/:id` - Get public trip (public)

## Next Steps / TODO

### High Priority
- [ ] Implement Itinerary Builder UI (add/edit/reorder stops)
- [ ] Implement Activity Search and Management
- [ ] Implement Budget Tracking and Cost Breakdown
- [ ] Create Stop and Activity CRUD APIs
- [ ] Create Checklist CRUD APIs
- [ ] Create Notes CRUD APIs

### Medium Priority
- [ ] City Search API and UI
- [ ] Trip Sharing functionality (public links, social sharing)
- [ ] Trip Copy functionality
- [ ] Image upload for trips and activities
- [ ] User profile editing
- [ ] Notification system

### Low Priority
- [ ] Admin Dashboard
- [ ] Analytics
- [ ] Advanced filtering and search
- [ ] Trip templates and recommendations
- [ ] Social features (follow users, comments)
- [ ] Calendar view for itineraries

## Development Workflow

1. **Start both servers**
   - Backend: `npm run dev` in `/backend`
   - Frontend: `npm run dev` in `/frontend`

2. **Make changes** to components, pages, or APIs

3. **Test** features in the browser at `http://localhost:3000`

4. **Build for production**
   - Backend: Already configured for deployment
   - Frontend: `npm run build` creates optimized bundle

## Common Commands

### Backend
```bash
npm run dev      # Development mode with auto-reload
npm start        # Production mode
npm test         # Run tests
```

### Frontend
```bash
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

## Database Models

### User
- name, email, password (hashed)
- profilePicture, language
- savedDestinations (array of City IDs)

### Trip
- name, description, userId
- startDate, endDate
- coverPhoto, budget
- stops (array of Stop IDs)
- isPublic, sharedWith

### Stop
- tripId, city, country
- startDate, endDate
- activities, accommodation
- notes, estimatedCost, order

### Activity
- stopId, name, category
- description, cost, duration
- date, time, images, notes

### City
- name, country, region
- costIndex, popularity
- description, image, tags

### Checklist
- tripId, items[]
  - name, category, isPacked

### Note
- tripId, stopId
- content, date

## Error Handling

The application includes:
- Basic validation on forms
- JWT token verification for protected routes
- MongoDB connection error handling
- CORS configuration

## Deployment

### Backend (Heroku, Vercel, or any Node.js host)
1. Create `.env` with production variables
2. Deploy with: `git push heroku main`

### Frontend (Vercel, Netlify, or any static host)
1. Run: `npm run build`
2. Deploy the `dist` folder

## Support

For questions or issues, please refer to the code comments or create an issue in the repository.

---

Happy traveling! 🌍✈️
