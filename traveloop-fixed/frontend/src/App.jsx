import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripDetail from './pages/TripDetail';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TripBudget from './pages/TripBudget';
import PublicTrip from './pages/PublicTrip';
import UserProfile from './pages/UserProfile';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Login />} />
          </>
        ) : (
          <>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/cities" element={<CitySearch />} />
              <Route path="/activities" element={<ActivitySearch />} />
              <Route path="/trip/:id" element={<TripDetail />} />
              <Route path="/trip/:id/builder" element={<ItineraryBuilder />} />
              <Route path="/trip/:id/budget" element={<TripBudget />} />
              <Route path="/trip/:id/checklist" element={<PackingChecklist />} />
              <Route path="/trip/:id/notes" element={<TripNotes />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </>
        )}
        <Route path="/trip/public/:id" element={<PublicTrip />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
