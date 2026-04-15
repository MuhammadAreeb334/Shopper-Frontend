import React from "react";
import "./NewsLetter.css";

const NewsLetter = () => {
  return (
    <section className="newsletter">
      <h1 className="newsletter__title">Get Exclusive Offers in Your Inbox</h1>
      <p className="newsletter__subtitle">
        Subscribe to our newsletter and stay updated.
      </p>

      <form className="newsletter__form" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Enter your email"
          aria-label="Email address"
          required
          className="newsletter__input"
        />
        <button type="submit" className="newsletter__button">
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsLetter;
