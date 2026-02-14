import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user, updateUserProfile, changePassword, deleteAccount, logout } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.displayName || '')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const [showDelete, setShowDelete] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const isEmailUser = user?.providerData?.[0]?.providerId === 'password'
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown'
  const initials = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase()

  async function handleSaveName(e) {
    e.preventDefault()
    if (!name.trim() || name.trim() === user?.displayName) return
    setSaving(true)
    setSaveMsg('')
    try {
      await updateUserProfile({ displayName: name.trim() })
      setSaveMsg('Name updated!')
    } catch {
      setSaveMsg('Failed to update name.')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setPwMsg('New password must be at least 6 characters.')
      return
    }
    setPwLoading(true)
    setPwMsg('')
    try {
      await changePassword(currentPassword, newPassword)
      setPwMsg('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwMsg('Current password is incorrect.')
      } else {
        setPwMsg('Failed to change password.')
      }
    } finally {
      setPwLoading(false)
    }
  }

  async function handleDelete() {
    setDeleteLoading(true)
    setDeleteError('')
    try {
      await deleteAccount(isEmailUser ? deletePassword : null)
      navigate('/login', { replace: true })
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setDeleteError('Incorrect password.')
      } else {
        setDeleteError('Failed to delete account. Try signing out and back in first.')
      }
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </div>

      {/* User info card */}
      <div className="card text-center">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="w-20 h-20 rounded-full mx-auto mb-3" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold mx-auto mb-3">
            {initials}
          </div>
        )}
        <form onSubmit={handleSaveName} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm text-center bg-gray-50 text-gray-500"
            />
          </div>
          <p className="text-xs text-gray-400">Member since {memberSince}</p>
          {name.trim() !== user?.displayName && (
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving...' : 'Save Name'}
            </button>
          )}
          {saveMsg && <p className="text-sm text-emerald-600">{saveMsg}</p>}
        </form>
      </div>

      {/* Change Password (email users only) */}
      {isEmailUser && (
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent"
            />
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent"
            />
            <button type="submit" disabled={pwLoading} className="btn-secondary w-full">
              {pwLoading ? 'Changing...' : 'Change Password'}
            </button>
            {pwMsg && (
              <p className={`text-sm ${pwMsg.includes('success') ? 'text-emerald-600' : 'text-red-500'}`}>{pwMsg}</p>
            )}
          </form>
        </div>
      )}

      {/* Danger Zone */}
      <div className="card border-red-100">
        <h2 className="font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">Once you delete your account, all data is permanently removed.</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)} className="w-full py-2.5 px-4 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
            Delete Account
          </button>
        ) : (
          <div className="space-y-3 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Are you sure? This cannot be undone.</p>
            {isEmailUser && (
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-red-200 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:border-transparent"
              />
            )}
            {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
            <div className="flex gap-2">
              <button onClick={() => { setShowDelete(false); setDeletePassword(''); setDeleteError('') }} className="flex-1 py-2.5 px-4 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading || (isEmailUser && !deletePassword)}
                className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
