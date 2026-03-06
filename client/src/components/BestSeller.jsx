import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

const BestSellers = () => {
    const { products } = useAppContext();

    if (!products || products.length === 0) return <p>No Best Sellers found.</p>;

    const bestSellers = products.slice(0, 4);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Best Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {bestSellers.map((product) => (
                    <ProductCard key={product._id || product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default BestSellers;
