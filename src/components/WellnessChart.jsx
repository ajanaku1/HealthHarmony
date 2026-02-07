import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export function MoodChart({ data }) {
  const chartData = data.slice(0, 14).reverse().map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.mood_score,
  }))

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-700 mb-4">Mood Trend</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No mood data yet. Start tracking!</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} />
            <YAxis domain={[0, 10]} fontSize={12} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function CalorieChart({ data }) {
  const chartData = data.slice(0, 14).reverse().map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calories: entry.nutrition?.calories || 0,
  }))

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-700 mb-4">Calorie Intake</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No meal data yet. Start logging!</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} />
            <Tooltip />
            <Bar dataKey="calories" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export function WorkoutChart({ data }) {
  const chartData = data.slice(0, 14).reverse().map((entry) => ({
    date: new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.form_score || 0,
  }))

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-700 mb-4">Workout Form Score</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">No workout data yet. Get moving!</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} />
            <YAxis domain={[0, 10]} fontSize={12} tickLine={false} />
            <Tooltip />
            <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
