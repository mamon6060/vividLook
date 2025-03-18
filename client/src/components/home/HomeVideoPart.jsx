import React from "react";
import Containar from "../containar/Containar";

const HomeVideoPart = () => {
  return (
    <div id="youtube">
      <div className="sm:pb-5 pt-[70px] sm:pt-[115px]">
        <Containar>
          <iframe
            className="h-[200px] sm:h-[490px] w-full rounded-3xl"
            src="https://www.youtube.com/embed/B4bGiAeLpwg"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </Containar>
      </div>
    </div>
  );
};

export default HomeVideoPart;
