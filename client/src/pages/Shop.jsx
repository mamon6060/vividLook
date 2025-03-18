/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Containar from "../components/containar/Containar";
import Skeleton from "react-loading-skeleton"; // Import skeleton loader
import "react-loading-skeleton/dist/skeleton.css";

import { FaBangladeshiTakaSign, FaChevronRight } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/pagination";
import api from "../components/axios/Axios";
import { Link, Outlet, useLocation } from "react-router-dom";
import PriceRange from "../components/shop/PriceRange";

const Shop = () => {
  const swiperRef = useRef(null);
  const [newRelease, setNewRelease] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const location = useLocation();

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
      const response = await api.get(`/category`);
      setCategoryList(response.data.data.doc);
    } catch (error) {
      console.error(error.message);
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

  return (
    <>
      <Containar>
        <div className="flex gap-2 items-center py-5 md:mt-16 mt-8">
          <Link className="font-medium" to={"/"}>
            Home{" "}
          </Link>
          <FaChevronRight className="text-[12px]" />
          <Link className="font-medium" to={"/shop"}>
            Spare Parts
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
                        Spare Parts Category
                      </h3>
                    </div>
                  </div>

                  {isLoading ? (
                    <Skeleton count={6} height={50} />
                  ) : (
                    categoryList.map((item, index) => (
                      <Link
                        to={`/shop/category/${item?.slug}`}
                        className={`w-full ${
                          item?.slug == lastSlug ? "text-primary" : "bg-white"
                        }  border-l border-b border-r inline-block`}
                        key={index}
                      >
                        <div>
                          <h3 className="text-[16px] font-semibold uppercase py-3 px-3">
                            {item?.title}
                          </h3>
                        </div>
                      </Link>
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

export default Shop;
