import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer.jsx'
import { useAppContext } from './context/AppContext.jsx'
import Login from './components/Login.jsx'

const App = () => {
  const location = useLocation()
  const isSellerPath = location.pathname.includes('/seller')
  const {showUserLogin} = useAppContext()

  return (
    <div>
    
      {!isSellerPath && <Navbar />}
      {showUserLogin ? <Login/>: null}
      <Toaster/>

      <div className={isSellerPath ? '' : 'px-6 md:px-16 lg:px-24 xl:px-32'}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      {!isSellerPath &&<Footer/>}
    </div>
  )
}

export default App
