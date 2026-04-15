import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import navLogo from "../../../assets/nav-logo.svg";
import { ShopContext } from "../../../Context/ShopContext";

const Navbar = () => {
  const { updateToken } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    updateToken(null, null);
    navigate("/login");
  };

  return (
    <nav className="h-20 bg-white border-b border-gray-200 px-4 lg:px-12 flex items-center sticky top-0 z-50 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        <img className="w-40" src={navLogo} alt="Company Logo" />

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
