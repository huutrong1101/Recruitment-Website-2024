import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useRedirectAfterLogin(role: string) {
  const navigate = useNavigate()

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin')
    } else if (role === 'recruiter') {
      navigate('/recruiter')
    } else {
      navigate('/')
    }
  }, [role, navigate])
}
