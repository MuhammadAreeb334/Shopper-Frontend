import React, { useState, useEffect } from "react";
import "./NewCollection.css";
import { FireAPI, baseUrl } from "../../hooks/useRequest";
import Items from "../Items/Items.jsx";

const NewCollections = () => {
  const [newCollection, setNewCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await FireAPI("api/products", "GET");
        const products = (data?.allProducts || [])
          .slice(-8)
          .reverse()
          .map((item) => ({
            ...item,
            id: item._id,
            image: `${baseUrl}${item.image?.[0] || ""}`,
          }));

        setNewCollection(products);
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
          {newCollection.map((item) => (
            <Items
              key={item.id}
              {...item}
              new_price={item.newPrice}
              old_price={item.oldPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewCollections;
