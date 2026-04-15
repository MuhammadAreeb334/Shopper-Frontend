import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Items from "../Components/Items/Items";

const ShopCategory = (props) => {
  const { products, loading } = useContext(ShopContext);

  const filteredProducts = products.filter(
    (items) => props.category === items.category,
  );

  if (loading) {
    return (
      <div className="shop-category">
        <img className="shopcategory-banner" src={props.banner} alt="" />
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={props.banner} alt="" />

      <div className="shopcategory-indexsort">
        <p>
          <span>Showing 1-{filteredProducts.length}</span> out of{" "}
          {filteredProducts.length} products
        </p>
      </div>
      <div className="shopcategory-products">
        {filteredProducts.map((items, key) => {
          if (props.category === items.category) {
            return (
              <Items
                key={key}
                id={items.id}
                name={items.name}
                image={items.image}
                new_price={items.new_price}
                old_price={items.old_price}
              />
            );
          }
        })}
        {filteredProducts.length > 12 && (
          <div className="shopcategory-loadmore">Explore more</div>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;
