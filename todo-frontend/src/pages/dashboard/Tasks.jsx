
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  LogOut,
  CheckCircle2,
  Circle,
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

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  const fetchTodos = async () => {
    try {
      setError('')
      const data = await todoService.getTodos()
      setTodos(data.todos)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggle = async (todo) => {
    try {
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

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length

  const pendingCount = todos.length - completedCount

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              className="rounded-xl p-3 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
            >
              <LogOut size={19} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold">
            Organise ton travail
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Crée, organise et suis l'avancement de tes activités.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        </section>

        {/* Create / Edit form */}
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
                  ? 'Mets à jour les informations.'
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
                <Plus size={17} />
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

        {/* Tasks list */}
        <section className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-100 p-6 dark:border-gray-800">
            <h3 className="font-bold">Toutes mes tâches</h3>
            <p className="mt-1 text-sm text-gray-500">
              {todos.length} tâche(s) enregistrée(s)
            </p>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Chargement...
              </p>
            ) : todos.length === 0 ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 text-gray-400" size={38} />
                <p className="font-semibold">Aucune tâche pour le moment</p>
                <p className="mt-2 text-sm text-gray-500">
                  Utilise le formulaire ci-dessus pour en créer une.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => (
                  <article
                    key={todo._id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 p-4 dark:border-gray-800 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <button
                        onClick={() => handleToggle(todo)}
                        title="Changer le statut"
                        className={`mt-1 shrink-0 ${
                          todo.completed
                            ? 'text-green-600'
                            : 'text-gray-400 hover:text-indigo-600'
                        }`}
                      >
                        {todo.completed
                          ? <CheckCircle2 size={21} />
                          : <Circle size={21} />}
                      </button>

                      <div className="min-w-0">
                        <h4
                          className={`font-semibold ${
                            todo.completed
                              ? 'text-gray-400 line-through'
                              : ''
                          }`}
                        >
                          {todo.title}
                        </h4>

                        <p className="mt-1 break-words text-sm text-gray-500">
                          {todo.description || 'Aucune description'}
                        </p>

                        <span
                          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                            todo.completed
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {todo.completed ? 'Terminée' : 'En cours'}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => handleEdit(todo)}
                        title="Modifier"
                        className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(todo._id)}
                        title="Supprimer"
                        className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Tasks
