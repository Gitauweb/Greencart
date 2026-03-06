
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets"; 
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setproducts] = useState([]);
    const [cartItems, setCartItems] = useState({});

  
    const fetchProducts = async () => {
        setproducts(dummyProducts);
    };

    
    const addTocart = (product) => {
        const ItemId = product._id || product.id;
        let cartData = structuredClone(cartItems);
        if (cartData[ItemId]) {
            cartData[ItemId] += 1;
        } else {
            cartData[ItemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart");
    };

   
    const removeFromCart = (productId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[productId]) {
            cartData[productId] -= 1;
            if (cartData[productId] <= 0) {
                delete cartData[productId];
            }
        }
        setCartItems(cartData);
        toast.success("Removed from cart");
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <AppContext.Provider
            value={{
                navigate,
                user,
                setUser,
                isSeller,
                setIsSeller,
                showUserLogin,
                setShowUserLogin,
                products,
                currency,
                addTocart,
                removeFromCart,
                cartItems,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
