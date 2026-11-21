
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ListTodo,
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    try {
      setLoading(true)

      await login({
        email: email.trim(),
        password,
      })

      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Email ou mot de passe incorrect.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">

      {/* Background video */}
      <video
        className="login-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/login-poster.jpg"
      >
        <source src="/Videos/molten.mp4" type="video/mp4" />
      </video>

      <div className="login-overlay" />

      {/* Main content */}
      <div className="login-content">

        <div className="login-brand">
          <div className="brand-icon">
            <ListTodo size={25} />
          </div>

          <span>TaskFlow</span>
        </div>

        <section className="login-card">

          <div className="login-card-header">

            <div className="login-welcome-icon">
              <CheckCircle2 size={27} />
            </div>

            <p className="login-eyebrow">
              YOUR PRODUCTIVITY SPACE
            </p>

            <h1>Welcome back.</h1>

            <p className="login-description">
              Connectez-vous et reprenez là où vous vous êtes arrêté.
            </p>

          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label htmlFor="email">Adresse email</label>

              <div className="login-input-wrapper">
                <Mail size={19} />

                <input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

            </div>

            <div className="login-field">

              <label htmlFor="password">Mot de passe</label>

              <div className="login-input-wrapper">
                <Lock size={19} />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                >
                  {showPassword
                    ? <EyeOff size={19} />
                    : <Eye size={19} />
                  }
                </button>
              </div>

            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight size={19} />
                </>
              )}
            </button>

          </form>

          <div className="login-divider">
            <span />
            <p>OU</p>
            <span />
          </div>

          <p className="login-register">
            Vous n'avez pas encore de compte ?
            <Link to="/register">Créer un compte</Link>
          </p>

        </section>

        <footer className="login-footer">
          <span>© 2026 TaskFlow</span>
          <span>Organize. Focus. Achieve.</span>
        </footer>

      </div>
    </main>
  )
}
