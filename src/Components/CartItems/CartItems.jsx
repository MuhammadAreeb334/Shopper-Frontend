import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { FireAPI } from "../../hooks/useRequest";

const CartItems = () => {
  const {
    token,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const handleCheckout = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }
      const cartArray = products
        .filter((item) => (cartItems?.[item.id] || 0) > 0)
        .map((item) => ({
          productId: item.id,
          quantity: cartItems[item.id],
        }));
      if (cartArray.length === 0) {
        toast.error("Cart is empty");
        return;
      }
      // console.log("CART ARRAY:", cartArray);
      const response = await FireAPI(
        "api/payment/checkout-session",
        "POST",
        { cartItems: cartArray },
        token,
      );
      if (response?.url) {
        window.location.href = response.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "Checkout failed");
    }
  };

  return (
    <div className="cart-items">
      <div className="cart-items-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>

      <hr />

      {products.map((item) => {
        const qty = cartItems?.[item.id] || 0;

        if (qty > 0) {
          return (
            <div className="cart-items-format" key={item.id}>
              <img src={item.image} alt="" className="cart-item-product-img" />

              <p>{item.name}</p>
              <p>${item.new_price}</p>

              <div className="quantity-box">
                <button
                  className="qty-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  –
                </button>

                <span className="qty-number">{qty}</span>

                <button className="qty-btn" onClick={() => addToCart(item.id)}>
                  +
                </button>
              </div>

              <p>${item.new_price * qty}</p>

              <FaTrash
                onClick={() => removeFromCart(item.id)}
                size={20}
                className="remove-icon"
              />
            </div>
          );
        }

        return null;
      })}

      <div className="cart-items-down">
        <div className="cart-items-total">
          <h1>Cart Total</h1>

          <div>
            <div className="cart-items-total-items">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>

            <hr />

            <div className="cart-items-total-items">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>

            <hr />

            <div className="cart-items-total-items">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>

          <button
            disabled={getTotalCartAmount() === 0}
            onClick={handleCheckout}
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
