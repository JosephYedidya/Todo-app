
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
  CheckCircle2,
  Circle,
  Clock3,
  ListTodo,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  CalendarDays,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import todoService from '../../services/todoService'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  // Classes visuelles selon le thème
  const pageBg = isDark
    ? 'bg-[#0b0b14] text-white'
    : 'bg-gray-50 text-gray-900'

  const cardBg = isDark
    ? 'border-white/[0.07] bg-[#141421]'
    : 'border-gray-200 bg-white shadow-sm'

  const sidebarBg = isDark
    ? 'border-white/[0.06] bg-[#11111d]'
    : 'border-gray-200 bg-white'

  const mutedText = 'text-gray-500'
  const primaryText = isDark ? 'text-white' : 'text-gray-900'

  // Récupération des tâches
  const fetchTodos = async () => {
    try {
      setError('')
      const data = await todoService.getTodos()
      setTodos(Array.isArray(data.todos) ? data.todos : [])
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Impossible de récupérer les tâches.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Déconnexion
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Modifier le statut d'une tâche
  const handleToggle = async (todo) => {
    try {
      setUpdatingId(todo._id)
      setError('')

      await todoService.updateTodo(todo._id, {
        completed: !todo.completed,
      })

      setTodos((previousTodos) =>
        previousTodos.map((item) =>
          item._id === todo._id
            ? { ...item, completed: !item.completed }
            : item
        )
      )
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Impossible de modifier cette tâche.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // Statistiques générales
  const completedTodos = todos.filter((todo) => todo.completed)
  const pendingTodos = todos.filter((todo) => !todo.completed)

  const totalTasks = todos.length
  const completedCount = completedTodos.length
  const pendingCount = pendingTodos.length

  const completionRate = totalTasks > 0
    ? Math.round((completedCount / totalTasks) * 100)
    : 0

  // Gestion des dates
  const getDateKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const todayKey = getDateKey(new Date())

  const nextSevenDays = new Date()
  nextSevenDays.setDate(nextSevenDays.getDate() + 7)

  const nextSevenDaysKey = getDateKey(nextSevenDays)

  const formatDueDate = (date) => {
    if (!date) return 'Sans échéance'

    return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
      'fr-FR',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  // Tâches en retard
  const overdueTodos = pendingTodos.filter(
    (todo) =>
      todo.dueDate &&
      todo.dueDate.slice(0, 10) < todayKey
  )

  // Tâches prioritaires non terminées
  const highPriorityTodos = pendingTodos.filter(
    (todo) => todo.priority === 'high'
  )

  // Échéances à venir
  const upcomingTodos = pendingTodos
    .filter((todo) => {
      if (!todo.dueDate) return false

      const dueDateKey = todo.dueDate.slice(0, 10)

      return (
        dueDateKey >= todayKey &&
        dueDateKey <= nextSevenDaysKey
      )
    })
    .sort((a, b) => {
      return a.dueDate.localeCompare(b.dueDate)
    })
    .slice(0, 5)

  // Initiales utilisateur
  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  // Date du jour
  const today = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  // Navigation
  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Mes tâches',
      path: '/tasks',
      icon: CheckSquare,
    },
    {
      name: 'Mon profil',
      path: '/profile',
      icon: UserRound,
    },
  ]

  // Cartes statistiques
  const statCards = [
    {
      title: 'Total des tâches',
      value: totalTasks,
      description: 'Toutes tes activités',
      icon: ListTodo,
      color: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
      accent: 'from-violet-500 to-purple-600',
    },
    {
      title: 'En cours',
      value: pendingCount,
      description: 'À accomplir',
      icon: Clock3,
      color: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      accent: 'from-amber-400 to-orange-500',
    },
    {
      title: 'Terminées',
      value: completedCount,
      description: 'Objectifs accomplis',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      accent: 'from-emerald-400 to-teal-500',
    },
    {
      title: 'En retard',
      value: overdueTodos.length,
      description: 'Échéances dépassées',
      icon: AlertTriangle,
      color: 'text-red-400',
      iconBg: 'bg-red-500/10',
      accent: 'from-red-400 to-rose-600',
    },
    {
      title: 'Priorité élevée',
      value: highPriorityTodos.length,
      description: 'À traiter en priorité',
      icon: TrendingUp,
      color: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
      accent: 'from-orange-400 to-red-500',
    },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-all duration-300 ${sidebarBg} ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >

        {/* Logo */}
        <div className={`flex h-24 items-center justify-between border-b px-7 ${
          isDark ? 'border-white/[0.06]' : 'border-gray-100'
        }`}>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <CheckSquare size={23} className="text-white" />
            </div>

            <div>
              <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>
                TaskFlow
              </h1>
              <p className={`text-[11px] ${mutedText}`}>
                Productivity workspace
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className={`rounded-lg p-2 transition lg:hidden ${
              isDark
                ? 'text-gray-400 hover:bg-white/5'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label="Fermer le menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-5 py-9">

          <p className={`mb-5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] ${mutedText}`}>
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
                    `group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-violet-500 ring-1 ring-violet-500/20'
                        : isDark
                          ? 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}

                  {item.path === '/dashboard' && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Productivity card */}
          <div className="mt-12 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-5">

            <div className="mb-4 flex items-center gap-2 text-violet-500">
              <Sparkles size={17} />
              <span className="text-xs font-semibold">
                Reste concentré
              </span>
            </div>

            <p className={`text-sm font-semibold ${primaryText}`}>
              Chaque petite action compte.
            </p>

            <p className={`mt-2 text-xs leading-5 ${mutedText}`}>
              Avance à ton rythme et transforme tes objectifs en résultats.
            </p>

          </div>
        </div>

        {/* User profile */}
        <div className={`border-t p-5 ${
          isDark ? 'border-white/[0.06]' : 'border-gray-100'
        }`}>

          <div
            onClick={() => navigate('/profile')}
            className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 transition ${
              isDark ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${primaryText}`}>
                {user?.name || 'Utilisateur'}
              </p>

              <p className={`truncate text-xs ${mutedText}`}>
                {user?.email || 'Email indisponible'}
              </p>
            </div>

            <ArrowUpRight size={16} className={mutedText} />
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Déconnexion
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen transition-colors duration-300 lg:ml-72">

        {/* TOPBAR */}
        <header className={`sticky top-0 z-30 flex h-20 items-center justify-between border-b px-5 backdrop-blur-xl transition-colors duration-300 sm:px-8 lg:px-10 ${
          isDark
            ? 'border-white/[0.06] bg-[#0b0b14]/90'
            : 'border-gray-200 bg-white/90'
        }`}>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className={`rounded-xl border p-2.5 transition lg:hidden ${
                isDark
                  ? 'border-white/10 text-gray-400 hover:bg-white/5'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
              aria-label="Ouvrir le menu"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className={`text-xs ${mutedText}`}>
                Workspace / Overview
              </p>
              <h2 className={`mt-1 text-lg font-bold ${primaryText}`}>
                Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className={`hidden items-center gap-2 text-xs md:flex ${mutedText}`}>
              <CalendarDays size={15} />
              <span className="capitalize">{today}</span>
            </div>

            {/* THEME SWITCH */}
            <button
              onClick={toggleTheme}
              title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              aria-label="Changer le thème"
              className={`rounded-xl border p-2.5 transition ${
                isDark
                  ? 'border-white/10 text-amber-300 hover:border-violet-500/40 hover:bg-white/5'
                  : 'border-gray-200 text-violet-600 hover:border-violet-300 hover:bg-violet-50'
              }`}
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
              {initials}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">

          {/* Welcome */}
          <section className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-500">
                <Sparkles size={13} />
                Ton espace de productivité
              </div>

              <h1 className={`text-3xl font-bold tracking-tight sm:text-4xl ${primaryText}`}>
                Bonjour {user?.name?.split(' ')[0] || 'à toi'} 👋
              </h1>

              <p className={`mt-3 text-sm ${mutedText}`}>
                Prêt à accomplir tes objectifs aujourd'hui ?
              </p>
            </div>

            <button
              onClick={() => navigate('/tasks')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-violet-600/30"
            >
              <Plus size={19} />
              Nouvelle tâche
            </button>

          </section>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
              <span>{error}</span>

              <button
                onClick={fetchTodos}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-red-500/10"
              >
                <RefreshCw size={15} />
                Réessayer
              </button>
            </div>
          )}

          {/* STATISTICS */}
          <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">

            {statCards.map((stat) => {
              const Icon = stat.icon

              const progressWidth =
                stat.title === 'Total des tâches'
                  ? totalTasks > 0 ? 100 : 0
                  : stat.title === 'Terminées'
                    ? completionRate
                    : stat.title === 'En cours'
                      ? totalTasks > 0
                        ? Math.round((pendingCount / totalTasks) * 100)
                        : 0
                      : totalTasks > 0
                        ? Math.round((stat.value / totalTasks) * 100)
                        : 0

              return (
                <article
                  key={stat.title}
                  className={`group relative overflow-hidden rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-500/20 ${cardBg}`}
                >

                  <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${stat.accent} opacity-[0.07] blur-2xl transition group-hover:opacity-20`} />

                  <div className="relative flex items-start justify-between">

                    <div>
                      <p className={`text-sm font-medium ${mutedText}`}>
                        {stat.title}
                      </p>

                      <p className={`mt-4 text-4xl font-bold tracking-tight ${primaryText}`}>
                        {loading ? '—' : stat.value}
                      </p>

                      <p className={`mt-2 text-xs ${mutedText}`}>
                        {stat.description}
                      </p>
                    </div>

                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.color}`}>
                      <Icon size={23} />
                    </div>

                  </div>

                  <div className={`mt-6 h-1 w-full overflow-hidden rounded-full ${
                    isDark ? 'bg-white/5' : 'bg-gray-100'
                  }`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.accent}`}
                      style={{
                        width: `${loading ? 0 : progressWidth}%`,
                      }}
                    />
                  </div>

                </article>
              )
            })}

          </section>

          {/* PRODUCTIVITY + PROGRESS */}
          <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">

            {/* Progress */}
            <article className={`rounded-2xl border p-6 xl:col-span-2 ${cardBg}`}>

              <div className="mb-7 flex items-center justify-between">
                <div>
                  <h3 className={`font-bold ${primaryText}`}>
                    Vue d'ensemble
                  </h3>
                  <p className={`mt-1 text-xs ${mutedText}`}>
                    Ton avancement global
                  </p>
                </div>

                <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
                  <TrendingUp size={20} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 sm:flex-row">

                {/* Progress circle */}
                <div
                  className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#8b5cf6 ${loading ? 0 : completionRate}%, ${isDark ? '#292938' : '#e5e7eb'} 0)`,
                  }}
                >
                  <div className={`flex h-32 w-32 flex-col items-center justify-center rounded-full ${
                    isDark ? 'bg-[#141421]' : 'bg-white'
                  }`}>
                    <span className={`text-3xl font-bold ${primaryText}`}>
                      {loading ? '—' : `${completionRate}%`}
                    </span>
                    <span className={`mt-1 text-[10px] ${mutedText}`}>
                      Complété
                    </span>
                  </div>
                </div>

                <div className="w-full flex-1 space-y-5">

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-emerald-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tâches terminées
                      </span>
                    </div>

                    <span className={`font-bold ${primaryText}`}>
                      {loading ? '—' : completedCount}
                    </span>
                  </div>

                  <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                      style={{
                        width: `${loading ? 0 : completionRate}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-amber-400" />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tâches en cours
                      </span>
                    </div>

                    <span className={`font-bold ${primaryText}`}>
                      {loading ? '—' : pendingCount}
                    </span>
                  </div>

                  <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{
                        width: `${loading || totalTasks === 0 ? 0 : Math.round((pendingCount / totalTasks) * 100)}%`,
                      }}
                    />
                  </div>

                  <p className={`border-t pt-4 text-xs leading-5 ${
                    isDark
                      ? 'border-white/[0.06] text-gray-500'
                      : 'border-gray-100 text-gray-500'
                  }`}>
                    {loading
                      ? 'Calcul de ta progression...'
                      : totalTasks === 0
                        ? 'Crée ta première tâche pour commencer ton suivi.'
                        : completionRate === 100
                          ? 'Excellent travail ! Toutes tes tâches sont terminées.'
                          : `Tu as terminé ${completedCount} tâche(s) sur ${totalTasks}. Continue comme ça !`
                    }
                  </p>

                </div>
              </div>
            </article>

            {/* Quick action */}
            <article className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border border-violet-500/20 p-6 ${
              isDark
                ? 'bg-gradient-to-br from-violet-600/20 via-[#19152d] to-[#141421]'
                : 'bg-gradient-to-br from-violet-50 via-white to-indigo-50'
            }`}>

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-500">
                  <Sparkles size={23} />
                </div>

                <h3 className={`text-xl font-bold ${primaryText}`}>
                  Un objectif en tête ?
                </h3>

                <p className={`mt-3 text-sm leading-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Note tes idées, planifie tes activités et garde le contrôle de ta journée.
                </p>
              </div>

              <button
                onClick={() => navigate('/tasks')}
                className="relative mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
              >
                Organiser mes tâches
                <ArrowUpRight size={17} />
              </button>

            </article>

          </section>

          {/* UPCOMING DEADLINES */}
          <section className={`mb-8 overflow-hidden rounded-2xl border ${cardBg}`}>

            <div className={`flex items-center justify-between border-b p-6 ${
              isDark ? 'border-white/[0.06]' : 'border-gray-100'
            }`}>
              <div>
                <h3 className={`font-bold ${primaryText}`}>
                  Échéances à venir
                </h3>
                <p className={`mt-1 text-xs ${mutedText}`}>
                  Les tâches à terminer dans les 7 prochains jours
                </p>
              </div>

              <div className="rounded-xl bg-violet-500/10 p-3 text-violet-500">
                <CalendarDays size={20} />
              </div>
            </div>

            <div className="p-6">

              {loading ? (
                <p className={`py-6 text-center text-sm ${mutedText}`}>
                  Chargement des échéances...
                </p>
              ) : upcomingTodos.length === 0 ? (
                <div className="py-8 text-center">
                  <CalendarDays
                    size={30}
                    className="mx-auto mb-3 text-gray-400"
                  />
                  <p className={`text-sm font-semibold ${primaryText}`}>
                    Aucune échéance proche
                  </p>
                  <p className={`mt-2 text-xs ${mutedText}`}>
                    Tu n'as aucune tâche à terminer dans les sept prochains jours.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTodos.map((todo) => (
                    <article
                      key={todo._id}
                      className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
                        isDark
                          ? 'border-white/[0.05] bg-white/[0.015]'
                          : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <h4 className={`truncate text-sm font-semibold ${primaryText}`}>
                          {todo.title}
                        </h4>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          {todo.description || 'Aucune description'}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                          todo.priority === 'high'
                            ? 'bg-red-500/10 text-red-500'
                            : todo.priority === 'low'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {todo.priority === 'high'
                            ? 'Priorité élevée'
                            : todo.priority === 'low'
                              ? 'Priorité faible'
                              : 'Priorité moyenne'}
                        </span>

                        <span className={`whitespace-nowrap text-xs font-medium ${
                          isDark ? 'text-violet-300' : 'text-violet-600'
                        }`}>
                          {formatDueDate(todo.dueDate)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* RECENT TASKS */}
          <section className={`overflow-hidden rounded-2xl border ${cardBg}`}>

            <div className={`flex flex-col justify-between gap-4 border-b p-6 sm:flex-row sm:items-center ${
              isDark ? 'border-white/[0.06]' : 'border-gray-100'
            }`}>

              <div>
                <h3 className={`font-bold ${primaryText}`}>
                  Mes dernières tâches
                </h3>

                <p className={`mt-1 text-xs ${mutedText}`}>
                  Consulte et actualise tes activités.
                </p>
              </div>

              <button
                onClick={() => navigate('/tasks')}
                className="flex items-center gap-2 text-sm font-semibold text-violet-500 transition hover:text-violet-400"
              >
                Voir toutes les tâches
                <ArrowUpRight size={16} />
              </button>

            </div>

            <div className="p-6">

              {loading ? (

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className={`h-16 animate-pulse rounded-xl ${
                        isDark ? 'bg-white/[0.04]' : 'bg-gray-100'
                      }`}
                    />
                  ))}
                </div>

              ) : todos.length === 0 ? (

                <div className="py-12 text-center">

                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
                    <CheckSquare size={30} />
                  </div>

                  <h4 className={`font-semibold ${primaryText}`}>
                    Aucune tâche pour le moment
                  </h4>

                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Commence par créer ta première tâche.
                  </p>

                  <button
                    onClick={() => navigate('/tasks')}
                    className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    <span className="flex items-center gap-2">
                      <Plus size={17} />
                      Créer une tâche
                    </span>
                  </button>

                </div>

              ) : (

                <div className="space-y-3">

                  {todos.slice(0, 5).map((todo) => (

                    <article
                      key={todo._id}
                      className={`flex flex-col justify-between gap-4 rounded-xl border p-4 transition hover:border-violet-500/30 sm:flex-row sm:items-center ${
                        isDark
                          ? 'border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03]'
                          : 'border-gray-100 bg-gray-50 hover:bg-violet-50/50'
                      }`}
                    >

                      <div className="flex min-w-0 items-start gap-3">

                        <button
                          onClick={() => handleToggle(todo)}
                          disabled={updatingId === todo._id}
                          title="Modifier le statut"
                          className={`mt-0.5 shrink-0 transition disabled:opacity-40 ${
                            todo.completed
                              ? 'text-emerald-400'
                              : isDark
                                ? 'text-gray-600 hover:text-violet-400'
                                : 'text-gray-400 hover:text-violet-600'
                          }`}
                        >
                          {todo.completed
                            ? <CheckCircle2 size={22} />
                            : <Circle size={22} />
                          }
                        </button>

                        <div className="min-w-0">

                          <h4
                            className={`truncate text-sm font-semibold ${
                              todo.completed
                                ? 'text-gray-500 line-through'
                                : isDark
                                  ? 'text-gray-200'
                                  : 'text-gray-800'
                            }`}
                          >
                            {todo.title}
                          </h4>

                          <p className={`mt-1 truncate text-xs ${
                            isDark ? 'text-gray-600' : 'text-gray-500'
                          }`}>
                            {todo.description || 'Aucune description'}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              todo.priority === 'high'
                                ? 'bg-red-500/10 text-red-500'
                                : todo.priority === 'low'
                                  ? 'bg-blue-500/10 text-blue-500'
                                  : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {todo.priority === 'high'
                                ? 'Priorité élevée'
                                : todo.priority === 'low'
                                  ? 'Priorité faible'
                                  : 'Priorité moyenne'}
                            </span>

                            {todo.dueDate && (
                              <span className={`flex items-center gap-1 text-[10px] ${
                                isDark ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                <CalendarDays size={12} />
                                {formatDueDate(todo.dueDate)}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      <div className="flex items-center gap-3 pl-8 sm:pl-0">

                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-semibold ${
                            todo.completed
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {todo.completed ? 'Terminée' : 'En cours'}
                        </span>

                        <button
                          onClick={() => navigate('/tasks')}
                          title="Gérer cette tâche"
                          className={`rounded-lg p-2 transition ${
                            isDark
                              ? 'text-gray-500 hover:bg-violet-500/10 hover:text-violet-300'
                              : 'text-gray-500 hover:bg-violet-100 hover:text-violet-600'
                          }`}
                        >
                          <ArrowUpRight size={17} />
                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </div>
          </section>

          {/* Footer */}
          <footer className={`mt-10 flex flex-col items-center justify-between gap-3 border-t py-6 text-xs sm:flex-row ${
            isDark
              ? 'border-white/[0.06] text-gray-600'
              : 'border-gray-200 text-gray-500'
          }`}>

            <p>
              © {new Date().getFullYear()} TaskFlow. Tous droits réservés.
            </p>

            <p className="flex items-center gap-2">
              Conçu pour une meilleure productivité
              <Sparkles size={13} className="text-violet-400" />
            </p>

          </footer>

        </div>
      </main>
    </div>
  )
}

export default Dashboard
