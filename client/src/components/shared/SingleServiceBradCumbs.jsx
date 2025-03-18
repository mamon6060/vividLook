import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Containar from "../containar/Containar";

const SingleServiceBradCumbs = ({ title, img }) => {
  return (
    <div
      className="relative md:py-20 py-12 md:mt-12 text-white"
      style={{
        background: `linear-gradient(270deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${img}) center center / cover no-repeat`,
      }}
    >
      {/* Content */}
      <Containar>
        <div className="flex flex-col justify-center h-full">
          <div className="relative flex items-center">
            <div className="flex items-center">
              <Link className="mr-2 text-gray-200" to={"/"}>
                Home
              </Link>
              <FaChevronRight className="text-[10px] mt-0.5" />
            </div>
            <div className="flex items-center">
              <Link className="mx-2 text-gray-200" to={"/services"}>
                Service
              </Link>
              <FaChevronRight className="text-[10px] mt-0.5" />
            </div>
            <div>
              <p className="mr-2 ml-2">{title}</p>
            </div>
          </div>
          <div className="md:mt-5">
            <div className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl font-semibold">
              {title}
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default SingleServiceBradCumbs;
