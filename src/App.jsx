import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop.jsx";

import UserLayout from "./Layout/UserLayout.jsx";
import AdminLayout from "./Layout/AdminLayout.jsx";

import Shop from "./Pages/Shop.jsx";
import ShopCategory from "./Pages/ShopCategory.jsx";
import Product from "./Pages/Product.jsx";
import Cart from "./Pages/Cart.jsx";
import LoginSignup from "./Pages/LoginSignup.jsx";

import AddProduct from "./Components/adminComponents/AddProduct/AddProduct.jsx";
import ListProduct from "./Components/adminComponents/ListProduct/ListProduct.jsx";
import EditProduct from "./Components/adminComponents/EditProduct/EditProduct.jsx";
import GuestRoute from "./Components/GuestRoute/GuestRoute.jsx";

import men_banner from "./assets/banner_mens.png";
import women_banner from "./assets/banner_women.png";
import kid_banner from "./assets/banner_kids.png";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#FF4141",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#FF4141",
            },
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        <Route path="cart" element={<Cart />} />
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginSignup />
            </GuestRoute>
          }
        />

        {/* ================= USER ROUTES ================= */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Shop />} />

          <Route
            path="mens"
            element={<ShopCategory banner={men_banner} category="mens" />}
          />
          <Route
            path="womens"
            element={<ShopCategory banner={women_banner} category="womens" />}
          />
          <Route
            path="kids"
            element={<ShopCategory banner={kid_banner} category="kids" />}
          />

          <Route path="product">
            <Route index element={<Product />} />
            <Route path=":productId" element={<Product />} />
          </Route>
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="list-product" replace />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="list-product" element={<ListProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
