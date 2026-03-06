import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className="relative w-full">

      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block"
      />

      
      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full block md:hidden"
      />

    
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16">

        <h1 className="text-2xl md:text-4xl font-bold text-black mb-4 max-w-xl">
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        <div className="flex items-center gap-4">

       
          <Link
            to="/products"
            className="
              inline-flex items-center gap-2
              px-7 py-3
              bg-green-600 hover:bg-green-700
              text-white
              rounded
              transition
            "
          >
            Shop now
            <img
              src={assets.white_arrow_icon}
              alt="arrow"
              className="w-4"
            />
          </Link>

          <Link
  to="/products"
  className="
    hidden md:inline-flex
    items-center gap-2
    text-black font-medium
    hover:underline
    transition
  "
>
  Explore deals
  <img
    src={assets.black_arrow_icon}
    alt="arrow"
    className="w-4 transition-transform hover:translate-x-1"
  />
</Link>


        </div>
      </div>
    </div>
  )
}

export default MainBanner
