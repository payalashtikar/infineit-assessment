import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/SignIn'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import AddProduct from './components/AddProduct'

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

        <Route path="/" element={<Login />} />

        <Route path="/homepage" element={<Homepage />} />
        <Route path="/addProduct" element={<AddProduct />} />

      </Routes>
    </>
  )
}

export default App
