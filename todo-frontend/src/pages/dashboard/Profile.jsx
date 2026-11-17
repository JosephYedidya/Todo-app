
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  UserRound,
  Mail,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  CheckSquare,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold">Mon profil</h1>
              <p className="text-xs text-gray-500">
                Workspace / Profil
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={17} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">

        {/* Profile introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold">Informations personnelles</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Consulte les informations de ton compte TaskFlow.
          </p>
        </section>

        {/* Profile card */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

          <div className="h-32 bg-linear-to-r from-indigo-600 to-violet-500" />

          <div className="px-6 pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-indigo-600 text-3xl font-bold text-white shadow-md dark:border-gray-900">
                {initials}
              </div>

              <div className="pb-2">
                <h3 className="text-xl font-bold">
                  {user?.name || 'Utilisateur'}
                </h3>
                <p className="text-sm text-gray-500">
                  {user?.email || 'Adresse e-mail indisponible'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal information */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <UserRound size={21} />
            </div>

            <div>
              <h3 className="font-bold">Informations du compte</h3>
              <p className="text-sm text-gray-500">
                Tes informations personnelles.
              </p>
            </div>
          </div>

          <div className="space-y-5">

            <div className="flex items-center gap-4 border-b border-gray-100 pb-5 dark:border-gray-800">
              <UserRound className="text-gray-400" size={20} />

              <div>
                <p className="text-xs text-gray-500">Nom complet</p>
                <p className="mt-1 font-medium">
                  {user?.name || 'Non renseigné'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-gray-400" size={20} />

              <div>
                <p className="text-xs text-gray-500">Adresse e-mail</p>
                <p className="mt-1 font-medium">
                  {user?.email || 'Non renseignée'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Account security */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-500/10">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3 className="font-bold">Sécurité du compte</h3>
              <p className="mt-2 text-sm text-gray-500">
                Ton espace est protégé par une authentification avec JWT.
              </p>
              <span className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Session authentifiée
              </span>
            </div>
          </div>
        </section>

        {/* Quick navigation */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <Link
            to="/dashboard"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900"
          >
            <LayoutDashboard className="text-indigo-600" size={24} />
            <div>
              <p className="font-semibold">Dashboard</p>
              <p className="text-sm text-gray-500">
                Retourner à l'accueil.
              </p>
            </div>
          </Link>

          <Link
            to="/tasks"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 dark:border-gray-800 dark:bg-gray-900"
          >
            <CheckSquare className="text-indigo-600" size={24} />
            <div>
              <p className="font-semibold">Mes tâches</p>
              <p className="text-sm text-gray-500">
                Gérer mes activités.
              </p>
            </div>
          </Link>

        </section>
      </div>
    </main>
  )
}

export default Profile
