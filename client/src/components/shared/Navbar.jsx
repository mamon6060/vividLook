/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Containar from "../containar/Containar";
import logo from "../../assets/logo/white_logo.png";
import { Link, NavLink } from "react-router-dom";

import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { IoReorderThree } from "react-icons/io5";
import api from "../axios/Axios";
import NavberDrawer from "../Drawer/NavberDrawer";
import SearchForm from "./SearchForm";
import { IoSearchOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSticky, setIsSticky] = useState(false); // New state for sticky navbar
  const [openSearch, setOpenSearch] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  let agroCart = useSelector((state) => state.agroCart);
  let cartAuth = useSelector((state) => state.auth);

  if (cartAuth && cartAuth?.user) {
    // cartAuth loop  where cartAuth?.user?._id math cartAuth loop this userId
    agroCart = agroCart.filter((item) => item.userId === cartAuth?.user?._id);
  } else {
    agroCart = agroCart.filter((item) => item.userId === null);
  }
  const totalItems = agroCart.reduce((total, item) => total + item.quantity, 0);
  const token = useSelector((state) => state.auth.token);

  const menulist = [
    {
      title: "Home",
      link: "/",
    },

    {
      title: "Products",
      link: "/products",
    },
    {
      title: "Spare Parts",
      link: "/shop",
    },
    {
      title: "Services",
      link: "/services",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await api.get("/users/getMe", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data.data.doc);
        } catch (error) {
          // Handle error (optional)
        }
      } else {
        // Clear user data if token is not available
        setUserData(null);
      }
    };

    fetchUserData();
  }, [token]); // Dependency includes token to refetch data when token changes

  // Add scroll event listener to update sticky state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isShopDrawerOpen, setShopDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setShopDrawerOpen((prevState) => !prevState);
  };

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("home-appliance-hierarchy");
        setData(response?.data?.data); // Store the fetched data
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // console.log("==============data", data);
  // if (loading)
  //   return (
  //     <div className="w-full h-screen fixed bg-[#51C07B] z-[999] top-0 flex items-center justify-center">
  //       <div className="w-[120px] h-[120px] border border-[#fff] rounded-full animate-spin">
  //         <img src={logo} alt="" className="p-4" />
  //       </div>
  //     </div>
  //   );

  if (loading)
    return (
      <div className="w-full h-screen fixed bg-[#51C07B] z-[999] top-0 flex items-center justify-center">
        <div className="w-[120px] h-[120px] border-b-2 border-[#fff] flex items-center justify-center overflow-hidden">
          <img
            src={logo}
            alt="Loading"
            className="p-4 animate-[slide_1.5s_ease-in-out_infinite]"
          />
        </div>
      </div>
    );

  const NavMenulist = [
    {
      title: "Home",
      link: "/",
    },

    {
      title: "Products",
      link: "/products",
      categoty: { data },
    },
    {
      title: "Spare Parts",
      link: "/shop",
    },
    {
      title: "Services",
      link: "/services",
    },
  ];
  return (
    <nav
      className={`transition-all duration-300 ease-in-out py-2 ${
        isSticky ? "bg-[#51c07b]" : "bg-[#51c07b] backdrop-blur-[3%]"
      } z-[9999] font-robo fixed left-0 top-0 w-full`}
    >
      <div className="2xl:px-64 xl:px-40 lg:px-12 px-8">
        <div className="flex justify-between  items-center">
          <div className="">
            <div className="md:w-[80px] w-[50px]">
              <Link to={"/"}>
                <img className="w-full" src={logo} alt="Logo" />
              </Link>
            </div>
          </div>

          <div className=" md:w-[50%] lg:w-[30%] mx-6 sm:mx-0 border border-[#fff]/60">
            <SearchForm />
          </div>

          <div className="hidden lg:flex items-center justify-between">
            <div className="flex 2xl:gap-x-8 xl:gap-6 gap-x-4 items-center relative">
              {NavMenulist?.map((item, index) => (
                <div key={index} className="group relative">
                  <NavLink
                    to={item?.link}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#fff]  xl:text-[17px] text-base font-bold relative before:bg-[#39FF14] before:absolute before:contents-[] before:left-0 before:-bottom-2 before:w-full before:h-[2px]"
                        : "text-[#fff]  xl:text-[17px] text-base relative before:bg-[#39FF14] before:absolute before:contents-[] before:right-0 before:-bottom-2 before:w-[0px] hover:before:w-full before:h-[2px] font-bold hover:text-[#39FF14] hover:before:left-0 transition-all ease-linear duration-150 before:transition-all before:ease-linear before:duration-100"
                    }
                  >
                    {item?.title}
                  </NavLink>

                  <div className=" absolute  w-[45%]  py-4 text-sm">
                    {item?.categoty?.data && (
                      <div className="absolute left-0 top-full w-[200px] bg-[#51C07B] rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pb-2 text-white">
                        {item?.categoty?.data.map((category, idx) => (
                          <div key={idx} className="relative group">
                            <div className="peer hover:bg-[#fff] hover:text-[#51C07B] px-4 py-2 cursor-pointer">
                              <Link
                                to={`products/category/${category?._id}/null/null`}
                              >
                                {category?.name}
                              </Link>
                            </div>

                            {/* Subcategory Dropdown (Appears when hovering category) */}
                            {category?.subcategories?.length > 0 && (
                              <div className="absolute left-full top-0 w-[200px] bg-[#51C07B] rounded-md shadow-md opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-300 py-1">
                                {category?.subcategories?.map(
                                  (subcategory, idx) => (
                                    <div key={idx} className="relative group">
                                      <div className="peer hover:bg-[#fff] hover:text-[#51C07B] px-4 py-2 cursor-pointer">
                                        <Link
                                          to={`products/category/${category?._id}/${subcategory._id}/null`}
                                        >
                                          {subcategory?.name}
                                        </Link>
                                      </div>

                                      {/* Subchildcategory Dropdown (Appears when hovering subcategory) */}
                                      {subcategory?.subchildcategories?.length >
                                        0 && (
                                        <div className="absolute left-full top-0 w-[200px] bg-[#51C07B] rounded-md shadow-md opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-300 py-1">
                                          {subcategory?.subchildcategories?.map(
                                            (subchildcategory, idx) => (
                                              <div
                                                key={idx}
                                                className="hover:bg-[#fff] hover:text-[#51C07B] px-4 py-2 cursor-pointer"
                                              >
                                                <Link
                                                  to={`products/category/${category?._id}/${subcategory._id}/${subchildcategory._id}`}
                                                >
                                                  {subchildcategory?.name}
                                                </Link>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/*  */}
                  </div>
                </div>
              ))}

              <p className="text-[yellow]">
                <span>Hotline</span>
                <br />
                <a href="tel:8801841782437" className="xl:text-xl text-base">
                  01841-782437
                </a>
              </p>

              <ul className="flex items-center gap-x-3">
                <li className="text-[#fff] text-[24px] ">
                  <Link to="/shoping-cart">
                    <div className="relative">
                      <HiOutlineShoppingBag />
                      <div className="absolute -left-1 -bottom-2 px-[7px] bg-[#269E4B] text-white py-0.5 text-[11px] rounded-full">
                        {totalItems}
                      </div>
                    </div>
                  </Link>
                </li>
                {userData?.photo ? (
                  <li className="text-black w-8 h-8 mt-1 rounded-full relative">
                    <Link
                      className="block w-full h-full rounded-full"
                      to="/profile"
                    >
                      <img
                        className="w-full h-full rounded-full"
                        src={userData?.photo}
                        alt="User"
                      />
                    </Link>
                  </li>
                ) : (
                  <li className="text-[#fff] text-[20px] relative">
                    <Link className="block" to="/profile">
                      <FaUser />
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="block lg:hidden pr-2 text-[#fff]">
            <ul className="flex items-center md:gap-x-2 gap-x-2 md:text-[24px] text-[20px]">
              {/* <li
                onClick={() => setOpenSearch(true)}
                className="text-white text-[20px] relative"
              >
                <IoSearchOutline className="block lg:hidden text-white text-2xl " />
              </li> */}
              <li className="text-white">
                <Link to="/shoping-cart">
                  <div className="relative">
                    <HiOutlineShoppingBag className="text-[#fff]" />
                    <div className="absolute -left-1 -bottom-4 px-1 bg-[#269E4B] py-0.5 md:text-[11px] rounded-full text-[10px]">
                      {totalItems}
                    </div>
                  </div>
                </Link>
              </li>
              {userData?.photo ? (
                <li className="text-white w-8 h-8 rounded-full relative">
                  <Link
                    className="block w-full h-full rounded-full"
                    to="/profile"
                  >
                    <img
                      className="w-full h-full rounded-full"
                      src={userData?.photo}
                      alt="User"
                    />
                  </Link>
                </li>
              ) : (
                <li className="text-white  relative">
                  <Link className="block" to="/profile">
                    <FaUser className="text-[#fff]" />
                  </Link>
                </li>
              )}
              <li className="text-white text-[20px] relative">
                <IoReorderThree
                  onClick={toggleDrawer}
                  className="block lg:hidden text-white  "
                />
              </li>
            </ul>
          </div>
        </div>

        <NavberDrawer
          menulist={menulist}
          isShopDrawerOpen={isShopDrawerOpen}
          toggleDrawer={toggleDrawer}
        ></NavberDrawer>
      </div>
    </nav>
  );
};

export default Navbar;
