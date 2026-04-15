import React, { createContext, useState, useEffect } from "react";
import { FireAPI, baseUrl } from "../hooks/useRequest";
import toast from "react-hot-toast";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null,
  );
  const updateToken = (newToken, userData = null) => {
    if (newToken) {
      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      setToken("");
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await FireAPI(`api/products`, "GET");
      // console.log("Fetched products:", data.allProducts);

      if (data && data.success) {
        const productsData = data.allProducts;
        const formattedProducts = productsData.map((product) => ({
          id: product._id,
          name: product.name,
          image: `${baseUrl}${product.image?.[0] || ""}`,
          new_price: product.newPrice,
          old_price: product.oldPrice,
          category: product.category,
          available: product.available,
          images: product.image || [],
        }));
        setProducts(formattedProducts);
        const initialCart = {};
        setCartItems(initialCart);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await FireAPI("api/cart", "GET", null, token);
      const cartData = {};
      data?.cart?.items.forEach((item) => {
        cartData[item.product._id] = item.quantity;
      });
      setCartItems(cartData);
      // console.log(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const addToCart = async (itemId) => {
    try {
      await FireAPI("api/cart/add", "POST", { productId: itemId }, token);
      setCartItems((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await FireAPI("api/cart/remove", "POST", { productId: itemId }, token);
      setCartItems((prev) => {
        const newCart = { ...prev };
        if (newCart[itemId] > 1) {
          newCart[itemId] -= 1;
        } else {
          delete newCart[itemId];
        }
        return newCart;
      });
    } catch (error) {
      console.error("Remove error:", error);
    }
  };
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = products.find((product) => product.id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalCartItems = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        totalCartItems += cartItems[itemId];
      }
    }
    return totalCartItems;
  };

  const contextValue = {
    token,
    user,
    updateToken,
    products,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    loading,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
