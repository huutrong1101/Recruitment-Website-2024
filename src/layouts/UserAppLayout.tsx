import { Outlet } from 'react-router-dom'
import Container from '../components/Container/Container'
import Footer from '../components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'

export default function UserAppLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />

      <div className='flex-grow'>
        <Container>
          <Outlet />
        </Container>
      </div>

      <Footer />
    </div>
  )
}
