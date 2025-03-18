/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Containar from "../components/containar/Containar";
import Skeleton from "react-loading-skeleton"; // Import skeleton loader
import "react-loading-skeleton/dist/skeleton.css";

import {  FaChevronRight } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/pagination";

import {
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import api from "../components/axios/Axios";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import PriceRange from "../components/shop/PriceRange";

const ProductPage = () => {
  const swiperRef = useRef(null);
  const [newRelease, setNewRelease] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const location = useLocation();
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [openDropdownChildIndex, setOpenDropdownChildIndex] = useState(null);

  const isCategoryPath = location.pathname.startsWith("/shop/category");

  const categoryName = isCategoryPath ? location.pathname.split("/").pop() : "";

  const getBanners = async () => {
    try {
      const response = await api.get(`/banners`);
      const groupedBanners = response?.data?.data?.doc.reduce((acc, banner) => {
        const { bannerType } = banner;
        if (!acc[bannerType]) {
          acc[bannerType] = [];
        }
        acc[bannerType].push(banner);
        return acc;
      }, {});
      setNewRelease(groupedBanners?.newRelease);
      setDeals(groupedBanners?.deals);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  const getCategory = async () => {
    try {
      const response = await api.get(`/home-appliance-hierarchy`);
      setCategoryList(response.data.data);
      console.log(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleDropdown = (index) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null); 
    } else {
      setOpenDropdownIndex(index); 
    }
  };

  const toggleChildDropdown = (index) => {
    if (openDropdownChildIndex === index) {
      setOpenDropdownChildIndex(null); 
    } else {
      setOpenDropdownChildIndex(index); 
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const lastSlug = location.pathname.split("/").pop();

  const { cgId, subCgId, childCgId } = useParams();

  return (
    <>
      <Containar>
        <div className="flex gap-2 items-center py-5 md:mt-16 mt-8">
          <Link className="font-medium" to={"/"}>
            Home{" "}
          </Link>
          <FaChevronRight className="text-[12px]" />
          <Link className="font-medium" to={"/products"}>
            Products
          </Link>
          {isCategoryPath && (
            <>
              <FaChevronRight className="text-[12px]" />
              <h3 className="capitalize">{categoryName}</h3>
            </>
          )}
        </div>
      </Containar>

      <div className="py-5 md:py-8 lg:py-14 bg-[#f5f5f5] md:px-20 px-6">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-3 hidden lg:block ">
            <div className="sticky top-[88px]">
              <div>
                <div className="shadow-md">
                  <div className="w-full bg-white border-l-2 border-t border-b border-r border-l-primary">
                    <div>
                      <h3 className="uppercase tracking-wide text-[18px] py-3.5 px-3 font-bold">
                        Product Category
                      </h3>
                    </div>
                  </div>

                  {isLoading ? (
                    <Skeleton count={6} height={50} />
                  ) : (
                    categoryList.map((item, index) => (
                      <div
                        key={index}
                        className={`w-full ${
                          item?._id === cgId ? " text-primary" : "bg-white"
                        } border-l border-b border-r inline-block`}
                      >
                        <div className="flex items-center justify-between">
                          {/* Category Name (Link) */}
                          <Link
                            to={`/products/category/${item?._id}/null/null`}
                            className="flex-1 text-[16px] py-3 px-3"
                          >
                            {item?.name}
                          </Link>

                          {/* Dropdown Button */}
                          <button
                            onClick={() => toggleDropdown(index)}
                            className="p-3 focus:outline-none"
                          >
                            {openDropdownIndex === index ? (
                              <FaChevronUp className="text-sm" />
                            ) : (
                              <FaChevronDown className="text-sm" />
                            )}
                          </button>
                        </div>

                        {/* Dropdown Content */}
                        {openDropdownIndex === index && (
                          <div className={`pl-4 bg-gray-50`}>
                            {item?.subcategories?.map(
                              (subcategory, subIndex) => (
                                <>
                                  <div
                                    className={`${
                                      subcategory?._id === subCgId
                                        ? " text-primary border-b border-l border-[#178843]/20"
                                        : "bg-white text-gray-700"
                                    }`}
                                  >
                                    <div className="flex justify-center">
                                      <Link
                                        key={subIndex}
                                        to={`/products/category/${item._id}/${subcategory?._id}/null`}
                                        className="block w-full px-4 py-2 text-[16px]"
                                      >
                                        {subcategory?.name}
                                      </Link>
                                      <button
                                        onClick={() =>
                                          toggleChildDropdown(subIndex)
                                        }
                                        className="p-3 focus:outline-none"
                                      >
                                        {openDropdownChildIndex === subIndex ? (
                                          <FaChevronUp className="text-sm" />
                                        ) : (
                                          <FaChevronDown className="text-sm" />
                                        )}
                                      </button>
                                    </div>
                                  </div>

                                  {openDropdownChildIndex === subIndex && (
                                    <div>
                                      <div
                                        className={`block w-full px-6 py-3 space-y-2`}
                                      >
                                        {subcategory?.subchildcategories?.map(
                                          (subChild, subCatIndex) => (
                                            <>
                                              <div
                                                className={`${
                                                  subChild?._id === childCgId
                                                    ? " text-primary border-b border-l border-[#178843]/20 px-2 py-1"
                                                    : "text-gray-700"
                                                }`}
                                              >
                                                <Link
                                                  key={subCatIndex}
                                                  to={`/products/category/${item._id}/${subcategory?._id}/${subChild?._id}`}
                                                >
                                                  {subChild.name}
                                                </Link>
                                              </div>
                                            </>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <PriceRange />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 sm:col-span-12">
            <div className="bg-white w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
