import React, { useState, useContext } from "react";
import "./Items.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import toast from "react-hot-toast";

const Items = (props) => {
  const { addToCart, token } = useContext(ShopContext);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    setIsAdded(true);

    try {
      await addToCart(props.id);
      toast.success(`${props.name} added to cart!`);
      setTimeout(() => {
        setIsAdded(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      setIsAdded(false);
    }
  };

  const imageUrl = Array.isArray(props.image) ? props.image[0] : props.image;

  // console.log("Image URL:", imageUrl); 

  return (
    <div className="items">
      {props.old_price && props.new_price && (
        <div className="discount-badge">
          -
          {Math.round(
            ((props.old_price - props.new_price) / props.old_price) * 100,
          )}
          %
        </div>
      )}

      <Link to={`/product/${props.id}`} className="items-link">
        <div className="image-container">
          <img
            src={imageUrl}
            alt={props.name}
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.src = "/placeholder-image.jpg"; // Add a placeholder image
            }}
          />
          <div className="quick-view-overlay">
            <button className="quick-view-btn">Quick View</button>
          </div>
        </div>
      </Link>

      <div className="items-content">
        <Link to={`/product/${props.id}`} className="product-link">
          <p className="product-name">{props.name}</p>
        </Link>

        <div className="rating">
          <div className="stars">
            {"★".repeat(Math.floor(props.rating || 4))}
            {"☆".repeat(5 - Math.floor(props.rating || 4))}
          </div>
          <span className="review-count">({props.reviews || 0})</span>
        </div>

        <div className="items_prices">
          <div className="items_price_new">${props.new_price}</div>
          <div className="items_price_old">${props.old_price}</div>
        </div>

        <div className="action-buttons">
          <button
            className={`add-to-cart-icon ${isAdded ? "added" : ""}`}
            onClick={handleAddToCart}
            title={token ? "Add to cart" : "Login to add to cart"}
          >
            {isAdded ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Items;
