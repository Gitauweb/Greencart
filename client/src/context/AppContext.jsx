
import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets"; 
import { toast } from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setproducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            if (response.data.success) {
                setproducts(response.data.products);
            }
        } catch (error) {
            console.log('Fetch products error:', error);
            // Fallback to dummy products
            setproducts(dummyProducts);
        }
    };

    // CART FUNCTIONS
    const fetchCart = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/cart`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setCart(response.data.cart);
            }
        } catch (error) {
            console.log('Fetch cart error:', error);
        }
    };

    const addTocart = async (product) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/cart/add`,
                { productId: product._id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCart(response.data.cart);
                toast.success("Added to cart");
            }
        } catch (error) {
            console.log('Add to cart error:', error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${API_URL}/cart/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCart(response.data.cart);
                toast.success("Removed from cart");
            }
        } catch (error) {
            console.log('Remove from cart error:', error);
            toast.error("Failed to remove from cart");
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `${API_URL}/cart/update`,
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCart(response.data.cart);
            }
        } catch (error) {
            console.log('Update cart error:', error);
            toast.error("Failed to update cart");
        }
    };

    // WISHLIST FUNCTIONS
    const fetchWishlist = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setWishlist(response.data.wishlist.products || []);
            }
        } catch (error) {
            console.log('Fetch wishlist error:', error);
        }
    };

    const addToWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/wishlist/add`,
                { productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setWishlist(response.data.wishlist.products);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            console.log('Add to wishlist error:', error);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${API_URL}/wishlist/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setWishlist(response.data.wishlist.products);
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            console.log('Remove from wishlist error:', error);
        }
    };

    // ORDERS FUNCTIONS
    const fetchOrders = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.log('Fetch orders error:', error);
        }
    };

    const createOrder = async (shippingAddress) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/orders`,
                { shippingAddress },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setCart(null);
                setOrders([response.data.order, ...orders]);
                toast.success("Order created successfully");
                return response.data.order;
            }
        } catch (error) {
            console.log('Create order error:', error);
            toast.error(error.response?.data?.message || "Failed to create order");
        }
    };

    // AUTHENTICATION FUNCTIONS
    const registerUser = async (name, email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                password,
            });

            if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setShowUserLogin(false);
                toast.success("Registration successful!");
                
                // Fetch cart and wishlist after login
                await fetchCart(response.data.token);
                await fetchWishlist(response.data.token);
                await fetchOrders(response.data.token);
                
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            });

            if (response.data.success) {
                setUser(response.data.user);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                setShowUserLogin(false);
                toast.success("Login successful!");
                
                // Fetch cart and wishlist after login
                await fetchCart(response.data.token);
                await fetchWishlist(response.data.token);
                await fetchOrders(response.data.token);
                
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        setUser(null);
        setCart(null);
        setWishlist([]);
        setOrders([]);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully!");
    };

    // Restore user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
            
            // Fetch user data
            fetchCart(savedToken);
            fetchWishlist(savedToken);
            fetchOrders(savedToken);
        }
    }, []);
    
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
                loginUser,
                registerUser,
                logoutUser,
                loading,
                cart,
                addTocart,
                removeFromCart,
                updateCartItem,
                fetchCart,
                wishlist,
                addToWishlist,
                removeFromWishlist,
                orders,
                createOrder,
                cartItems,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
