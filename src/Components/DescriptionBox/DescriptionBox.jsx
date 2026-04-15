import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-boc">Description</div>
        <div className="descriptionbox-nav-boc">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima odit
          hic maxime culpa ab earum laboriosam deleniti modi, ut at possimus
          magni, harum incidunt minus atque voluptatibus perspiciatis eaque
          ipsam.
        </p>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nihil
          temporibus, voluptatum maxime id ipsam minus, sunt autem dolores
          aliquam voluptatem vel? Illum, libero labore sunt sit voluptatem
          aperiam neque rerum.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
