import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import MealAnalyzer from './pages/MealAnalyzer'
import WorkoutCoach from './pages/WorkoutCoach'
import MoodTracker from './pages/MoodTracker'
import ChatCoach from './pages/ChatCoach'
import Progress from './pages/Progress'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meals" element={<MealAnalyzer />} />
        <Route path="/workout" element={<WorkoutCoach />} />
        <Route path="/mood" element={<MoodTracker />} />
        <Route path="/chat" element={<ChatCoach />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Layout>
  )
}
