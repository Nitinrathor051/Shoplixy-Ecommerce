import React from "react";
import "./About.css"; // optional if you want styling

const About = () => {
  return (
    <div className="about-page" style={{ padding: "20px" }}>
      <h1>About Shoplixy</h1>
      <p>
        Welcome to <strong>Shoplixy</strong>, your trusted destination for seamless online shopping.
      </p>
      <p>
        At Shoplixy, we aim to bring together quality products, reliable sellers, and a user-friendly experience,
        all in one platform.
      </p>
      <p>
        Whether you're browsing the latest trends or shopping for daily essentials, Shoplixy makes your experience smooth and secure.
      </p>
      <p>Thank you for being a part of the Shoplixy community!</p>
    </div>
  );
};

export default About;
