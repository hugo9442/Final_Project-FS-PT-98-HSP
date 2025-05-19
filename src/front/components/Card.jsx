
import React from "react";

const Card = ({ image, text, alt = "imagen" }) => {
  return (
    <div className="card mx-auto mb-5" style={{ width: "18rem" }}>
      <img src={image} className="card-img-top" alt={alt} />
      <div className="card-body">
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default Card;
