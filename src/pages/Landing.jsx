import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Landing() {
  const { user, loginAsGuest } = useAuth()
  const navigate = useNavigate()

  if (user) return <Navigate to="/dashboard" replace />

  async function handleTryDemo() {
    try {
      await loginAsGuest()
      navigate('/dashboard')
    } catch (err) {
      console.error('Demo login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/HHlogo.png" alt="Health Harmony" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-lg gradient-text">Health Harmony</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleTryDemo} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
              Try Demo
            </button>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Your <span className="gradient-text">AI-Powered</span> Wellness Coach
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track meals, workouts, and mood with intelligent AI analysis. Get personalized insights to build healthier habits — all in one beautiful app.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-3.5 inline-block">
              Get Started — It&apos;s Free
            </Link>
            <button onClick={handleTryDemo} className="btn-secondary text-base px-8 py-3.5">
              Try Demo
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {[
              { icon: '📸', label: 'Meal Analysis' },
              { icon: '💪', label: 'Workout Coach' },
              { icon: '🧠', label: 'Mood Tracking' },
              { icon: '📊', label: 'Progress' },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm"
              >
                <span>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to <span className="gradient-text">Thrive</span>
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
              Powerful AI tools that make wellness tracking effortless and insightful.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                ),
                title: 'Meal Analyzer',
                desc: 'Snap a photo of your meal and get instant AI-powered nutrition analysis with calorie and macro breakdowns.',
                color: 'bg-emerald-50',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                ),
                title: 'Workout Coach',
                desc: 'AI-powered form checking and personalized exercise guidance to help you train smarter.',
                color: 'bg-teal-50',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                ),
                title: 'Mood Tracker',
                desc: 'Log your emotions daily and discover patterns between your mood, diet, and activity.',
                color: 'bg-cyan-50',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                ),
                title: 'Progress Dashboard',
                desc: 'Visualize your wellness journey with beautiful charts, streaks, and achievement tracking.',
                color: 'bg-emerald-50',
              },
            ].map((feature) => (
              <div key={feature.title} className="card hover:shadow-lg transition-shadow duration-300">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: (
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                  </svg>
                ),
                title: 'Create Your Free Account',
                desc: 'Sign up in seconds with email or Google. No credit card required.',
              },
              {
                step: '2',
                icon: (
                  <svg className="w-7 h-7 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ),
                title: 'Set Your Wellness Goals',
                desc: 'Tell us about your health objectives so we can personalize your experience.',
              },
              {
                step: '3',
                icon: (
                  <svg className="w-7 h-7 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                ),
                title: 'Start Tracking with AI',
                desc: 'Log meals, workouts, and moods. Our AI analyzes everything and guides your progress.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Start Your Wellness Journey Today
          </h2>
          <p className="mt-4 text-emerald-100 text-lg max-w-xl mx-auto">
            Join Health Harmony and let AI help you build lasting healthy habits. Free to use, always.
          </p>
          <div className="mt-8">
            <Link
              to="/signup"
              className="inline-block bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-colors text-base shadow-lg"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/HHlogo.png" alt="Health Harmony" className="w-7 h-7 rounded-lg" />
              <span className="font-semibold text-white">Health Harmony</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Health Harmony. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
