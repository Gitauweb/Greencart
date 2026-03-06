import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, setUser, setShowUserLogin } = useAppContext()
  const navigate = useNavigate()

  const cartCount = 3

  const logout = () => {
    setUser(null)
    navigate('/')
    setOpen(false)
    setProfileOpen(false)
  }

  return (

    <nav className="sticky top-0 z-50 bg-white border-b border-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 py-4">

      <div className="flex items-center justify-between relative">

        
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img className="h-9" src={assets.logo} alt="logo" />
        </NavLink>

   
        <div className="hidden sm:flex items-center gap-8">

          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">All Products</NavLink>
          <NavLink to="/">Contact</NavLink>

          {/* Search */}
          <div className="hidden lg:flex items-center gap-2 border px-3 rounded-full">
            <input
              type="text"
              placeholder="Search products"
              className="py-1.5 bg-transparent outline-none text-sm"
            />
            <img src={assets.search_icon} alt="search" className="w-4 h-4" />
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => navigate('/cart')}
          >
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 flex items-center justify-center px-1.25 text-[11px] font-bold text-white bg-green-600 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Login / Profile */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <ul className="absolute right-0 mt-2 w-40 bg-white shadow rounded text-sm">
                  <li
                    onClick={() => {
                      navigate('/orders')
                      setProfileOpen(false)
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    My Orders
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* ================= Mobile Menu Button ================= */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden"
          aria-label="Menu"
        >
          <img src={assets.menu_icon} alt="menu" />
        </button>

        {/* ================= Mobile Menu ================= */}
        {open && (
          <div
            className="
              absolute top-full left-0 w-full
              bg-white shadow-md
              py-4 flex flex-col gap-3
              px-5 text-sm
              sm:hidden
              z-50
            "
          >
            <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>

            {user && (
              <NavLink to="/orders" onClick={() => setOpen(false)}>My Orders</NavLink>
            )}

            <NavLink to="/" onClick={() => setOpen(false)}>Contact</NavLink>

            <button
              onClick={() => {
                navigate('/cart')
                setOpen(false)
              }}
              className="flex items-center gap-2 mt-2"
            >
              <img src={assets.nav_cart_icon} alt="cart" className="w-5 h-5" />
              <span className="font-medium text-green-600">
                Cart ({cartCount})
              </span>
            </button>

            {!user ? (
              <button
                onClick={() => {
                  setShowUserLogin(true)
                  setOpen(false)
                }}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-2"
              >
                Login
              </button>
            ) : (
              <button
                onClick={logout}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
