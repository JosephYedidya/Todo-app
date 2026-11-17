
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CheckSquare,
  UserRound,
  LogOut,
  Plus,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import todoService from '../../services/todoService'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await todoService.getTodos()
        setTodos(data.todos)
      } catch (error) {
        console.error(error)
        setError(
          error.response?.data?.message ||
          'Impossible de récupérer les tâches.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const completedTodos = todos.filter((todo) => todo.completed)
  const pendingTodos = todos.filter((todo) => !todo.completed)

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes tâches', path: '/tasks', icon: CheckSquare },
    { name: 'Mon profil', path: '/profile', icon: UserRound },
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <CheckSquare size={22} />
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 px-4 py-8">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* User profile */}
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.name || 'Utilisateur'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {user?.email || 'Adresse e-mail indisponible'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen lg:ml-64">

        {/* Topbar */}
        <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-5 dark:border-gray-800 dark:bg-gray-900 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-sm text-gray-500">
                Workspace / Overview
              </p>
              <h1 className="text-lg font-bold">Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <span className="hidden text-sm text-gray-500 sm:block">
              Bonjour, {user?.name?.split(' ')[0] || 'Utilisateur'}
            </span>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={
                theme === 'light'
                  ? 'Activer le mode sombre'
                  : 'Activer le mode clair'
              }
              aria-label={
                theme === 'light'
                  ? 'Activer le mode sombre'
                  : 'Activer le mode clair'
              }
              className="rounded-xl border border-gray-200 p-2.5 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-5 sm:p-8">

          {/* Welcome section */}
          <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">
                Bonjour {user?.name?.split(' ')[0] || 'à toi'} 👋
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Voici un aperçu de ton activité aujourd'hui.
              </p>
            </div>

            <button
              onClick={() => navigate('/tasks')}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              Nouvelle tâche
            </button>
          </section>

          {/* Statistics */}
          <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500">Total des tâches</p>
              <p className="mt-3 text-3xl font-bold">
                {todos.length}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Toutes tes tâches
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500">Terminées</p>
              <p className="mt-3 text-3xl font-bold text-green-600">
                {completedTodos.length}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Tâches accomplies
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-sm text-gray-500">En cours</p>
              <p className="mt-3 text-3xl font-bold text-amber-500">
                {pendingTodos.length}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Tâches à terminer
              </p>
            </div>

          </section>

          {/* Recent tasks */}
          <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
              <div>
                <h3 className="font-bold">Mes dernières tâches</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Consulte tes activités récentes.
                </p>
              </div>

              <button
                onClick={() => navigate('/tasks')}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Voir tout
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <p className="text-sm text-gray-500">
                  Chargement des tâches...
                </p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : todos.length === 0 ? (
                <div className="py-10 text-center">
                  <CheckSquare className="mx-auto mb-3 text-gray-400" size={35} />
                  <p className="font-medium">
                    Tu n'as pas encore créé de tâche.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Crée ta première tâche pour commencer.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todos.slice(0, 5).map((todo) => (
                    <div
                      key={todo._id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                    >
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">
                          {todo.title}
                        </h3>
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {todo.description || 'Aucune description'}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                          todo.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {todo.completed ? 'Terminée' : 'En cours'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}

export default Dashboard
