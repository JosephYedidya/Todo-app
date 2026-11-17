
import api from './api'

// Récupérer toutes les tâches
const getTodos = async () => {
  const response = await api.get('/todos')
  return response.data
}

// Créer une tâche
const createTodo = async (todoData) => {
  const response = await api.post('/todos', todoData)
  return response.data
}

// Modifier une tâche
const updateTodo = async (id, updates) => {
  const response = await api.put(`/todos/${id}`, updates)
  return response.data
}

// Supprimer une tâche
const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`)
  return response.data
}

const todoService = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
}

export default todoService
