import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '@/utils/supabase'

export const useRegister = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', school: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Set flag before signUp because Supabase auto-signs-in on success,
    // which triggers GuestGuard redirect before the lines after signUp run.
    sessionStorage.setItem('newUser', form.username)

    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          username: form.username,
          school: form.school,
        },
      },
    })

    if (signUpError) {
      sessionStorage.removeItem('newUser')
      setError(signUpError.message)
      setLoading(false)
      return
    }

    await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    })

    navigate('/dashboard')
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return { form, error, loading, handleChange, handleSubmit, handleGoogleLogin }
}