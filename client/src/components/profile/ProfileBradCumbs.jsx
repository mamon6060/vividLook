import React from "react";
import Containar from "../containar/Containar";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

const ProfileBradCumbs = () => {
  return (
    <div className="bg-white">
      <div className="py-16">
        <Containar>
          <div className="flex items-center">
            <div className="flex items-center">
              <Link className="mr-2 font-semibold" to={"/"}>
                Home
              </Link>
              <FaChevronRight className="text-[10px] mt-0.5" />
            </div>
            <div className="flex items-center">
              <div className="mr-2 ml-2 ">Profile</div>
              <FaChevronRight className="text-[10px] mt-0.5" />
            </div>
            <div>
              <p className="mr-2 ml-2">Sourav Acherjee</p>
            </div>
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default ProfileBradCumbs;
