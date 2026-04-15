import React from "react";
import "./BreadCrums.css";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const BreadCrums = ({ product }) => {
  return (
    <div className="bread-crums">
      <Link to="/">HOME</Link> <FaChevronRight />{" "}
      <Link to="/">SHOP</Link> <FaChevronRight />{" "}
      <span>{product.category}</span> <FaChevronRight />{" "}
      <span>{product.name}</span>
    </div>
  );
};

export default BreadCrums;
