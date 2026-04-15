import React, { useState, useEffect } from "react";
import "./NewCollection.css";
import { FireAPI } from "../../hooks/useRequest";
import Items from "../Items/Items.jsx";

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await FireAPI("api/products", "GET");
        const products = data?.allProducts || [];
        
        if (products.length > 0) {
          const latestProducts = [...products]
            .sort((a, b) => new Date(b.date) - new Date(a.date)) 
            .slice(0, 8)
            .map((item) => ({
              id: item._id,
              name: item.name,
              image: item.image?.[0] || "",
              images: item.image || [],
              newPrice: item.newPrice,
              oldPrice: item.oldPrice,
              category: item.category,
              available: item.available,
              date: item.date,
            }));

          setNewCollection(latestProducts);
        }
      } catch (error) {
        console.error("Failed to fetch new collection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTION</h1>
      <hr />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-b-2 border-red-500 rounded-full" />
        </div>
      ) : (
        <div className="collections">
          {newCollection.length > 0 ? (
            newCollection.map((item) => (
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
            <div className="text-center py-8 text-gray-500">
              No products available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewCollections;