import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addTocart, removeFromCart, cartItems } = useAppContext();

    if (!product) return null; 

    const productId = product._id || product.id;
    const quantity = cartItems[productId] || 0;

    
    const imgSrc = Array.isArray(product.image)
        ? product.image[0]
        : product.image || assets.placeholder_img;

    return (
        <div className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full">
            <div className="group cursor-pointer flex items-center justify-center px-2">
                <img
                    className="group-hover:scale-105 transition max-w-26 md:max-w-36"
                    src={imgSrc}
                    alt={product.name || "Product"}
                />
            </div>

            <div className="text-gray-500/60 text-sm">
                <p>{product.category || "Category"}</p>
                <p className="text-gray-700 font-medium text-lg truncate w-full">{product.name}</p>

                <div className="flex items-center gap-0.5">
                    {Array(5).fill("").map((_, i) => (
                        <img
                            key={i}
                            className="md:w-3.5"
                            src={i < (product.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                            alt=""
                        />
                    ))}
                    <p>({product.rating || 0})</p>
                </div>

                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-indigo-500">
                        {currency}${product.offerPrice || 0}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                            {currency}${product.price || 0}
                        </span>
                    </p>

                    <div className="text-indigo-500">
                        {quantity === 0 ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium"
                                onClick={() => addTocart(product)}
                            >
                                <img src={assets.cart_icon} alt="cart_icon" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                                <button
                                    onClick={() => removeFromCart(productId)}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    -
                                </button>
                                <span className="w-5 text-center">{quantity}</span>
                                <button
                                    onClick={() => addTocart(product)}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
 +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
