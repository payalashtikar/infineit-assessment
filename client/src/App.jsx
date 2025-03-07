import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/SignIn'
import Register from './pages/SignUp'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Landingpage from './pages/Landingpage'
import Cart from './components/Cart'
import MyOrders from './components/Order'

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/homepage')
    }
  }, [])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signUp" element={<Register />} />
        <Route path="/signIn" element={<Login />} />

        {
          isUserLoggedIn && <>
            {/* <Navbar /> */}
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/cartItem" element={<Cart />} />
            <Route path="/myorder" element={<MyOrders />} />


          </>
        }
      </Routes>
    </>
  )
}

export default App
