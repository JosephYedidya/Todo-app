
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  LogOut,
  CheckCircle2,
  Circle,
  Search,
  CalendarDays,
  Flag,
  ListFilter,
  ArrowUpDown,
  Clock,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import todoService from '../../services/todoService'

const Tasks = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Formulaire
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState(null)

  // Recherche et filtres
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('date')

  const fetchTodos = async () => {
    try {
      setError('')
      const data = await todoService.getTodos()
      setTodos(data.todos || [])
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

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!title.trim()) {
      setError('Le titre de la tâche est obligatoire.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const todoData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate || null,
      }

      if (editingId) {
        await todoService.updateTodo(editingId, todoData)
      } else {
        await todoService.createTodo(todoData)
      }

      resetForm()
      await fetchTodos()
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Une erreur est survenue.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (todo) => {
    setEditingId(todo._id)
    setTitle(todo.title)
    setDescription(todo.description || '')
    setPriority(todo.priority || 'medium')
    setDueDate(
      todo.dueDate ? todo.dueDate.slice(0, 10) : ''
    )

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggle = async (todo) => {
    try {
      setError('')

      await todoService.updateTodo(todo._id, {
        completed: !todo.completed,
      })

      await fetchTodos()
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Impossible de modifier le statut.'
      )
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Veux-tu vraiment supprimer cette tâche ?'
    )

    if (!confirmed) return

    try {
      setError('')
      await todoService.deleteTodo(id)
      await fetchTodos()
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Impossible de supprimer cette tâche.'
      )
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Comparaison des dates sans problème de fuseau horaire
  const getToday = () => {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const isOverdue = (todo) => {
    return (
      !todo.completed &&
      todo.dueDate &&
      todo.dueDate.slice(0, 10) < getToday()
    )
  }

  const isDueSoon = (todo) => {
    if (!todo.dueDate || todo.completed || isOverdue(todo)) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const due = new Date(`${todo.dueDate.slice(0, 10)}T00:00:00`)

    const difference = Math.ceil(
      (due - today) / (1000 * 60 * 60 * 24)
    )

    return difference <= 2
  }

  const formatDate = (date) => {
    if (!date) return 'Aucune échéance'

    return new Date(`${date.slice(0, 10)}T00:00:00`)
      .toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
  }

  // Statistiques
  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length

  const pendingCount = todos.length - completedCount

  const overdueCount = todos.filter(isOverdue).length

  const priorityConfig = {
    low: {
      label: 'Faible',
      style: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    },
    medium: {
      label: 'Moyenne',
      style: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    },
    high: {
      label: 'Élevée',
      style: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    },
  }

  // Recherche, filtrage et tri
  const filteredTodos = useMemo(() => {
    let result = [...todos]

    const searchValue = search.toLowerCase().trim()

    if (searchValue) {
      result = result.filter((todo) =>
        `${todo.title} ${todo.description || ''}`
          .toLowerCase()
          .includes(searchValue)
      )
    }

    if (filter === 'pending') {
      result = result.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      result = result.filter((todo) => todo.completed)
    }

    if (filter === 'overdue') {
      result = result.filter(isOverdue)
    }

    if (sort === 'priority') {
      const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1,
      }

      result.sort(
        (a, b) =>
          (priorityOrder[b.priority] || 2) -
          (priorityOrder[a.priority] || 2)
      )
    }

    if (sort === 'date') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1

        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    }

    return result
  }, [todos, search, filter, sort])

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-xl font-bold">Mes tâches</h1>
              <p className="text-xs text-gray-500">
                Espace de travail / Tâches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {user?.name || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              title="Déconnexion"
              className="rounded-xl p-3 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <LogOut size={19} />
            </button>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">

        {/* INTRODUCTION */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold">
            Organise ton travail
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Planifie tes activités, définis tes priorités et respecte tes échéances.
          </p>
        </section>

        {/* STATISTIQUES */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Toutes les tâches</p>
            <p className="mt-2 text-3xl font-bold">{todos.length}</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">En cours</p>
            <p className="mt-2 text-3xl font-bold text-amber-500">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">Terminées</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500">En retard</p>
            <p className="mt-2 text-3xl font-bold text-red-500">
              {overdueCount}
            </p>
          </div>

        </section>

        {/* FORMULAIRE */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              {editingId ? <Pencil size={20} /> : <Plus size={20} />}
            </div>

            <div>
              <h3 className="font-bold">
                {editingId ? 'Modifier la tâche' : 'Créer une tâche'}
              </h3>

              <p className="text-sm text-gray-500">
                {editingId
                  ? 'Mets à jour les informations de ton activité.'
                  : 'Ajoute une nouvelle activité à ton espace.'}
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Titre de la tâche
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex : Terminer mon projet Full-Stack"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Décris brièvement cette tâche..."
                rows={3}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Flag size={16} />
                  Niveau de priorité
                </label>

                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <CalendarDays size={16} />
                  Date limite
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
                />
              </div>

            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {editingId ? <Pencil size={17} /> : <Plus size={17} />}

                {saving
                  ? 'Enregistrement...'
                  : editingId
                    ? 'Enregistrer les modifications'
                    : 'Ajouter la tâche'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <X size={17} />
                  Annuler
                </button>
              )}

            </div>

          </form>
        </section>

        {/* LISTE DES TÂCHES */}
        <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

          <div className="border-b border-gray-100 p-6 dark:border-gray-800">
            <h3 className="font-bold">Toutes mes tâches</h3>

            <p className="mt-1 text-sm text-gray-500">
              {filteredTodos.length} résultat(s) sur {todos.length} tâche(s)
            </p>
          </div>

          {/* RECHERCHE ET FILTRES */}
          <div className="space-y-4 border-b border-gray-100 p-6 dark:border-gray-800">

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex flex-wrap items-center gap-2">

                <ListFilter size={17} className="text-gray-400" />

                {[
                  { value: 'all', label: 'Toutes' },
                  { value: 'pending', label: 'En cours' },
                  { value: 'completed', label: 'Terminées' },
                  { value: 'overdue', label: 'En retard' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      filter === item.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

              </div>

              <div className="flex items-center gap-2">

                <ArrowUpDown size={16} className="text-gray-400" />

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="date">Par échéance</option>
                  <option value="priority">Par priorité</option>
                </select>

              </div>

            </div>
          </div>

          {/* CONTENU */}
          <div className="p-6">

            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Chargement des tâches...
              </p>
            ) : filteredTodos.length === 0 ? (
              <div className="py-10 text-center">

                <CheckCircle2
                  className="mx-auto mb-3 text-gray-400"
                  size={38}
                />

                <p className="font-semibold">
                  {todos.length === 0
                    ? 'Aucune tâche pour le moment'
                    : 'Aucun résultat trouvé'}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {todos.length === 0
                    ? 'Utilise le formulaire ci-dessus pour créer ta première tâche.'
                    : 'Essaie de modifier ta recherche ou tes filtres.'}
                </p>

              </div>
            ) : (

              <div className="space-y-3">

                {filteredTodos.map((todo) => {
                  const currentPriority =
                    priorityConfig[todo.priority] ||
                    priorityConfig.medium

                  return (
                    <article
                      key={todo._id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-indigo-200 dark:border-gray-800 dark:hover:border-indigo-500/40 sm:flex-row sm:items-center"
                    >

                      <div className="flex min-w-0 items-start gap-3">

                        <button
                          onClick={() => handleToggle(todo)}
                          title="Changer le statut"
                          className={`mt-1 shrink-0 transition ${
                            todo.completed
                              ? 'text-green-600'
                              : 'text-gray-400 hover:text-indigo-600'
                          }`}
                        >
                          {todo.completed
                            ? <CheckCircle2 size={22} />
                            : <Circle size={22} />}
                        </button>

                        <div className="min-w-0">

                          <h4
                            className={`break-words font-semibold ${
                              todo.completed
                                ? 'text-gray-400 line-through'
                                : ''
                            }`}
                          >
                            {todo.title}
                          </h4>

                          <p className="mt-1 break-words text-sm text-gray-500 dark:text-gray-400">
                            {todo.description || 'Aucune description'}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">

                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              todo.completed
                                ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                            }`}>
                              {todo.completed ? 'Terminée' : 'En cours'}
                            </span>

                            <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${currentPriority.style}`}>
                              <Flag size={12} />
                              {currentPriority.label}
                            </span>

                            {todo.dueDate && (
                              <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                isOverdue(todo)
                                  ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                  : isDueSoon(todo)
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                              }`}>
                                {isOverdue(todo)
                                  ? <Clock size={12} />
                                  : <CalendarDays size={12} />}

                                {formatDate(todo.dueDate)}

                                {isOverdue(todo) && ' · En retard'}
                                {isDueSoon(todo) && ' · Bientôt'}
                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          onClick={() => handleEdit(todo)}
                          title="Modifier"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(todo._id)}
                          title="Supprimer"
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </article>
                  )
                })}

              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  )
}

export default Tasks
