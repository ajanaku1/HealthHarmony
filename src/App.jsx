import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import MealAnalyzer from './pages/MealAnalyzer'
import WorkoutCoach from './pages/WorkoutCoach'
import MoodTracker from './pages/MoodTracker'
import ChatCoach from './pages/ChatCoach'
import Progress from './pages/Progress'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Demo from './pages/Demo'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/demo" element={<Demo />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/meals" element={<MealAnalyzer />} />
                <Route path="/workout" element={<WorkoutCoach />} />
                <Route path="/mood" element={<MoodTracker />} />
                <Route path="/chat" element={<ChatCoach />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
