import React, { useState, useEffect } from "react";
import "./RelatedProduct.css";
import { FireAPI, baseUrl } from "../../hooks/useRequest";
import Items from "../Items/Items.jsx";

const RelatedProducts = ({ currentProductId, currentCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!currentCategory) return;
      try {
        const data = await FireAPI("api/products", "GET");
        const products = data?.allProducts || [];

        const filtered = products
          .filter(
            (p) => p.category === currentCategory && p._id !== currentProductId,
          )
          .sort(() => 0.5 - Math.random())
          .slice(0, 4)
          .map((item) => ({
            ...item,
            id: item._id,
            image: `${baseUrl}${item.image?.[0] || ""}`,
          }));

        setRelatedProducts(filtered);
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, currentCategory]);

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-b-2 border-red-500 rounded-full" />
        </div>
      ) : (
        <div className="relatedproducts-items">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((item) => (
              <Items
                key={item.id}
                {...item}
                new_price={item.newPrice}
                old_price={item.oldPrice}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No related products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
