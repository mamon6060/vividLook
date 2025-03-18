/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";
import logo from "../../assets/logo/white_logo.png";
import Drawer from "react-modern-drawer";
import { Link, NavLink } from "react-router-dom";
import { socialLink } from "../constants";

const NavberDrawer = ({ menulist, isShopDrawerOpen, toggleDrawer }) => {
  return (
    <>
      <Drawer
        open={isShopDrawerOpen}
        onClick={toggleDrawer}
        direction="left"
        className="bla bla bla lg:hidden bg-[#51C07B]"
      >
        <div
          onClick={() => toggleDrawer(false)}
          className="h-screen lg:w-80 bg-[#27A259] z-50  transition-transform duration-300 ease-in-out lg:hidden"
        >
          <div className="flex justify-between px-8 pt-12">
            <img className="w-[60px] h-[60px]" src={logo} alt="Logo" />
            <RxCross2
              // onClick={() => toggleDrawer(false)}
              className="w-7 h-7 p-1 font-extrabold bg-green-500 rounded text-white mt-8"
            />
          </div>
          <ul className="my-8 space-y-4 px-8">
            {menulist?.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item?.link}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#fff] text-[17px] font-bold relative before:bg-[#fff] before:absolute before:contents-[] before:left-0 before:-bottom-3 before:w-full before:h-[2px]"
                      : "text-[#fff] text-[17px] relative before:bg-[#fff] before:absolute before:contents-[] before:right-0 before:-bottom-3 before:w-[0px] hover:before:w-full before:h-[2px] font-bold hover:text-[#fff] hover:before:left-0 transition-all ease-linear duration-150 before:transition-all before:ease-linear before:duration-100"
                  }
                >
                  {item?.title}
                </NavLink>
                <hr className="mt-2" />
              </li>
            ))}
          </ul>
          <div className="ps-8">
            <h2 className="font-bold text-2xl my-3 text-[#fff]">Social</h2>
            <div className="flex gap-3">
              <ul className="flex items-center flex-wrap gap-x-[14px] mt-3">
                {socialLink.map((item, index) => {
                  const Icon = item?.icon;
                  return (
                    <li className="text-[#fff]" key={index}>
                      <Link
                        className={`w-10 h-10 justify-center bg-white hover:scale-125 transition-all ease-linear duration-150 items-center flex rounded-full text-[15px] hover:text-white`}
                        to={item.link}
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
      </Drawer>
    </>
  );
};

export default NavberDrawer;
