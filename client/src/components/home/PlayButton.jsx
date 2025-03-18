import React from "react";

const PlayButton = () => {
  return (
    <div className="container">
      <a className="button is-play" href="#">
        <div className="button-outer-circle has-scale-animation"></div>
        <div className="button-outer-circle has-scale-animation has-delay-short"></div>
        <div className="button-icon is-play">
          <svg height="100%" width="100%" fill="#f857a6">
            <polygon
              className="triangle"
              points="5,0 30,15 5,30"
              viewBox="0 0 30 15"
            ></polygon>
            <path
              className="path"
              d="M5,0 L30,15 L5,30z"
              fill="none"
              stroke="#f857a6"
              stroke-width="1"
            ></path>
          </svg>
        </div>
      </a>
    </div>
  );
};

export default PlayButton;
