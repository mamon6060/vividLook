import React from "react";
import img from "../../assets/logo/logo.png";
import { socialLink } from "../../components/constants";
import { Link } from "react-router-dom";

const CompanyTag = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <Link to="/">
          <div className="w-36 h-36 mx-auto mb-10 rounded-full flex justify-center items-center bg-white">
            <img className="w-24" src={img} alt="Logo" />
          </div>
        </Link>
        <div className="max-w-[600px] text-center mx-auto">
          <h2 className="text-[36px] text-white font-robo font-semibold">
            Madina Refrigeration
          </h2>
          <p className="text-xl font-normal text-white mt-10 leading-[38px]">
            Reliable Cooling Solutions: Your Trusted Source for Quality,
            Innovation, and Long-Lasting Refrigeration Services.
          </p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <ul className="flex items-center gap-5">
            {socialLink.map((item, index) => {
              const Icon = item?.icon;
              return (
                <li className="text-black" key={index}>
                  <Link
                    className={`w-10 h-10 justify-center bg-white hover:scale-125 transition-all ease-linear duration-150 items-center flex rounded-full text-[15px] hover:text-white`}
                    to={item?.link}
                    target="_blank"
                    style={{ color: item?.color }}
                  >
                    <Icon />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyTag;
