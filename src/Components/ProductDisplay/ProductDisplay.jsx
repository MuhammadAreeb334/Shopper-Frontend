import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import { ShopContext } from "../../Context/ShopContext";
import toast from "react-hot-toast";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const hasDiscount = product.old_price > product.new_price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.old_price - product.new_price) / product.old_price) * 100,
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(product.id);
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add to cart");
    } else {
      toast.success(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="product-display">
      <div className="product-display-left">
        <div className="product-display-img-list">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              className={selectedImage === index ? "active" : ""}
            />
          ))}
        </div>
        <div className="product-display-img">
          <img
            className="product-display-mainimg"
            src={images[selectedImage]}
            alt={product.name}
          />
        </div>
      </div>

      <div className="product-display-right">
        <h1>{product.name}</h1>

        <div className="product-display-right-prices">
          {hasDiscount && <div className="price-old">${product.old_price}</div>}
          <div className="price-new">${product.new_price}</div>
          {hasDiscount && (
            <div className="price-discount">-{discountPercentage}%</div>
          )}
        </div>

        {/* <p className="product-display-right-description">
          {product.description ||
            "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment."}
        </p> */}

        <div className="product-display-right-size">
          <h2>Select Size</h2>
          <div className="product-display-right-sizes">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={selectedSize === size ? "active" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleAddToCart} className="add-to-cart-btn">
          ADD TO CART
        </button>

        <p className="product-display-right-category">
          <span>Category:</span> {product.category || "Uncategorized"}
        </p>
        <p className="product-display-right-category">
          <span>Availability:</span>{" "}
          {product.available ? (
            <span className="text-green-600">In Stock</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
