import React, { useState, useEffect } from "react";
import "./Popular.css";
import { FireAPI } from "../../hooks/useRequest";
import Items from "../Items/Items";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const data = await FireAPI("api/products", "GET");
        const products = data?.allProducts;

        if (products && products.length > 0) {
          const filtered = products
            .filter((p) => p.category === "womens")
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map((item) => ({
              id: item._id,
              name: item.name,
              image: item.image?.[0] || "",
              images: item.image || [],
              newPrice: item.newPrice,
              oldPrice: item.oldPrice,
              category: item.category,
              available: item.available,
            }));

          setPopularProducts(filtered);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />

      {loading ? (
        <div className="animate-spin h-10 w-10 border-b-2 border-red-500 rounded-full" />
      ) : (
        <div className="popular_items">
          {popularProducts.length > 0 ? (
            popularProducts.map((item) => (
              <Items
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.newPrice}
                old_price={item.oldPrice}
                category={item.category}
              />
            ))
          ) : (
            <p>No women's products available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Popular;
