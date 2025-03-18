import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Containar from "../containar/Containar";

const SinglePageBradCumbs = ({ title }) => {
  return (
    <div className="py-16 md:mt-4">
      <Containar>
        <div className="flex items-center">
          <div className="flex items-center">
            <Link className="mr-2 font-semibold" to={"/"}>
              Home
            </Link>
            <FaChevronRight className="text-[10px] mt-0.5" />
          </div>
          <div className="flex items-center">
            <Link className="mr-2 ml-2 font-semibold" to={"/shop"}>
              Shop
            </Link>
            <FaChevronRight className="text-[10px] mt-0.5" />
          </div>
          <div>
            <p className="mr-2 ml-2">{title}</p>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default SinglePageBradCumbs;
