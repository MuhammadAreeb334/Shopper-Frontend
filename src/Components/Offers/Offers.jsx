import React from "react";
import "./Offers.css";
import exclusive_img from "../../assets/exclusive_image.png";

const Offers = () => {
  return (
    <section className="offers">
      <div className="offers-content">
        <div className="offer-text">
          <h1>Exclusive</h1>
          <h1>Offer For You</h1>
          <p>Only on our best-selling products</p>
          <button>Check Now</button>
        </div>

        <div className="offer-image">
          <img src={exclusive_img} alt="Exclusive Offer" />
        </div>
      </div>
    </section>
  );
};

export default Offers;
