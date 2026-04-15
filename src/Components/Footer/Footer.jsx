import React from "react";
import "./Footer.css";
import footerLogo from "../../assets/logo_big.png";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const links = ["Company", "Product", "Offices", "About", "Contact"];

  return (
    <footer className="footer">
      <div className="footer__logo">
        <img src={footerLogo} alt="Shopper Logo" />
        <span>SHOPPER</span>
      </div>

      <ul className="footer__links">
        {links.map((link, index) => (
          <li key={index}>{link}</li>
        ))}
      </ul>

      <div className="footer__social">
        {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, index) => (
          <div className="footer__icon" key={index}>
            <Icon />
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <hr />
        <p>© {new Date().getFullYear()} Shopper. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
