import React, { useState, useEffect } from "react";
import "./Popular.css";
import { FireAPI, baseUrl } from "../../hooks/useRequest";
import Items from "../Items/Items";

const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const data = await FireAPI("api/products", "GET");
        const products = data?.allProducts;

        const filtered = products
          .filter((p) => p.category === "womens")
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map((item) => ({
            ...item,
            id: item._id,
            image: `${baseUrl}${item.image?.[0] || ""}`,
          }));

        setPopularProducts(filtered);
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
                {...item}
                new_price={item.newPrice}
                old_price={item.oldPrice}
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
