import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";

const GuestRoute = ({ children }) => {
  const { token, user } = useContext(ShopContext);

  if (token && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} />;
  }

  return children;
};

export default GuestRoute;
